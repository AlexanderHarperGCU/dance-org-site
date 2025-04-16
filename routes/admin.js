module.exports = (coursesDB, bookingsDB) => {
  const express = require('express');
  const router = express.Router();
  const Datastore = require('nedb');
  const organisersDB = new Datastore({ filename: './data/organisers.db', autoload: true });

  organisersDB.count({}, (err, count) => {
    if (!err && count === 0) {
      organisersDB.insert({ username: 'admin', password: 'pass' });
    }
  });

  router.get('/login', (req, res) => {
    if (req.session && req.session.loggedIn) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/login');
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    organisersDB.findOne({ username, password }, (err, org) => {
      if (org) {
        req.session.loggedIn = true;
        res.redirect('/admin/dashboard');
      } else {
        res.render('admin/login', { error: 'Invalid credentials' });
      }
    });
  });
  
  router.get('/dashboard', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/admin/login');
    coursesDB.find({}, (err, courses) => {
      res.render('admin/dashboard', { courses });
    });
  });

  router.post('/add-course', (req, res) => {
    const course = {
      name: req.body.name,
      duration: req.body.duration,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      price: parseFloat(req.body.price) || 0,
      upcoming: req.body.upcoming === 'on' 
    };
    coursesDB.insert(course, () => res.redirect('/admin/dashboard'));
  });

  router.post('/delete-course', (req, res) => {
    coursesDB.remove({ _id: req.body.id }, {}, () => res.redirect('/admin/dashboard'));
  });

  router.get('/edit-course/:id', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/admin/login');
    coursesDB.findOne({ _id: req.params.id }, (err, course) => {
      if (err || !course) return res.redirect('/admin/dashboard');
      res.render('admin/edit', { course });
    });
  });
  
  router.post('/edit-course/:id', (req, res) => {
    const updated = {
      name:        req.body.name,
      duration:    req.body.duration,
      description: req.body.description,
      location:    req.body.location,
      date:        req.body.date,
      time:        req.body.time,
      price:       parseFloat(req.body.price) || 0,
      upcoming:    req.body.upcoming === 'on'
    };
    coursesDB.update({ _id: req.params.id }, { $set: updated }, {}, () => {
      res.redirect('/admin/dashboard');
    });
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  router.get('/organisers', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/admin/login');
    organisersDB.find({}, (err, orgs) => {
      res.render('admin/organisers', { organisers: orgs });
    });
  });
  
  router.post('/organisers/add', (req, res) => {
    organisersDB.insert({
      username: req.body.username,
      password: req.body.password
    }, () => res.redirect('/admin/organisers'));
  });
 
  router.post('/organisers/delete', (req, res) => {
    organisersDB.remove({ _id: req.body.id }, {}, () => res.redirect('/admin/organisers'));
  });

  router.get('/classlist/:courseId', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/admin/login');
    const courseId = req.params.courseId;
  
    bookingsDB.find({ courseId }, (err, participants) => {
      coursesDB.findOne({ _id: courseId }, (err2, course) => {
        res.render('admin/classlist', {
          courseName: course.name,
          courseId,
          participants
        });
      });
    });
  });
  
  router.post('/classlist/remove', (req, res) => {
    bookingsDB.remove({ _id: req.body.id }, {}, () => {
      res.redirect(`/admin/classlist/${req.body.courseId}`);
    });
  });

  return router;
};