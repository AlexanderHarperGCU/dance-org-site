module.exports = (coursesDB) => {
  const express = require('express');
  const router = express.Router();

  router.get('/login', (req, res) => {
    if (req.session && req.session.loggedIn) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/login');
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'pass') {
      req.session.loggedIn = true;
      res.redirect('/admin/dashboard');
    } else {
      res.send('Invalid login');
    }
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
      description: req.body.description
    };
    coursesDB.insert(course, () => res.redirect('/admin/dashboard'));
  });

  router.post('/delete-course', (req, res) => {
    coursesDB.remove({ _id: req.body.id }, {}, () => res.redirect('/admin/dashboard'));
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  return router;
};