var express = require('express');
const { response } = require('../app');
var router = express.Router();
const adminHelpers = require('../helpers/admin-Helpers')
const blogHelpers = require('../helpers/blog-Helpers')
const passport = require('passport');
const bcrypt = require('bcrypt');
const isAdmin = require('../config/auth').isAdmin
const isNotAdmin = require('../config/auth').isNotAdmin

/* GET home page. */
router.get('/', async (req, res, next) => {
  let categories = await adminHelpers.getCategories();
  blogHelpers.getBlogs().then((blogs) => {
    res.render('blogs/index', {blogs, categories});
  })
});

router.get('/login', isNotAdmin, function (req, res, next) {
  // let userData = {}
  // userData.username = "omar";
  // userData.password = "omar";
  // adminHelpers.doRegister(userData).then((response) => {
  //   res.render('admin/admin-blogs/login', { login: true });
  // })
  res.render('admin/admin-blogs/login', { login: true });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/admin/view-blogs'
}), (err, req, res, next) => {
  if (err) next(err);
});



module.exports = router;