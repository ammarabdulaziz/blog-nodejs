var express = require('express');
var router = express.Router();
const isAdmin = require('../config/auth').isAdmin
const isNotAdmin = require('../config/auth').isNotAdmin

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/admin-blogs/view-blogs');
});

router.get('/view-blogs', isAdmin, function (req, res, next) {
  res.render('admin/admin-blogs/view-blogs', { admin: true });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
