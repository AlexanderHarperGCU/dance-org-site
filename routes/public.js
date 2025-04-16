module.exports = (coursesDB) => {
  const express = require('express');
  const router = express.Router();
  const Datastore = require('nedb');

  const bookingsDB = new Datastore({ filename: './data/bookings.db', autoload: true });

  router.get('/', (req, res) => {
    res.render('index');
  });

  router.get('/courses', (req, res) => {
    coursesDB.find({}, (err, all) => {
      if (err) return res.sendStatus(500);
  
      const upcomingCourses = all.filter(c => c.upcoming);
      const currentCourses  = all.filter(c => !c.upcoming);
  
      res.render('courseList', {
        courses:      currentCourses,
        upcomingCourses
      });
    });  
  });

  router.get('/course/:id', (req, res) => {
    coursesDB.findOne({ _id: req.params.id }, (err, course) => {
      res.render('classDetails', { course });
    });
  });

  router.post('/enrol', (req, res) => {
    const { name, email, courseId } = req.body;

    bookingsDB.insert({ name, email, courseId }, err => {
      if (err) return res.status(500).send('Something went wrong.');
      res.render('enrollment');
    });
  });

  return router;
};