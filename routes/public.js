const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const coursesDB = new Datastore({ filename: './data/courses.db', autoload: true });

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/courses', (req, res) => {
  coursesDB.find({}, (err, courses) => {
    res.render('courseList', { courses });
  });
});

router.get('/course/:id', (req, res) => {
  coursesDB.findOne({ _id: req.params.id }, (err, course) => {
    res.render('classDetails', { course });
  });
});

router.post('/enrol', (req, res) => {
  res.send('Thank you for enrolling!');
});

module.exports = router;