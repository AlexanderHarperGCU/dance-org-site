const fs = require('fs');
const path = require('path');
const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const Datastore = require('nedb');
const { Parser } = require('json2csv');

const dataDir = process.env.DATA_DIR || '/tmp/data';
fs.mkdirSync(dataDir, { recursive: true });

const bookingsDB = new Datastore({
  filename: path.join(dataDir, 'bookings.db'),
  autoload: true
});
const coursesDB = new Datastore({
  filename: path.join(dataDir, 'courses.db'),
  autoload: true
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

const publicRoutes = require('./routes/public')(coursesDB, bookingsDB);
const adminRoutes = require('./routes/admin')(coursesDB, bookingsDB);

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/admin/export/:courseId', (req, res) => {
  const courseId = req.params.courseId;

  bookingsDB.find({ courseId }, (err, bookings) => {
    if (err || bookings.length === 0) {
      return res.status(404).send('No bookings found.');
    }

    const fields = ['name', 'email', 'courseId'];
    const json2csv = new Parser({ fields });

    try {
      const csv = json2csv.parse(bookings);
      res.header('Content-Type', 'text/csv');
      res.attachment('class_list.csv');
      return res.send(csv);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed to generate CSV');
    }
  });
});