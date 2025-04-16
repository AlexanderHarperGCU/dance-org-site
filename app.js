const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const path = require('path');
const Datastore = require('nedb');
const { Parser } = require('json2csv');

const bookingsDB = new Datastore({ filename: './data/bookings.db', autoload: true });

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

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
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