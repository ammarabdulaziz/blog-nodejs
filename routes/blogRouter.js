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
  let categoryDetails = await blogHelpers.getCategoryCount(); //Includes category count for category list side-bar
  let categories = await adminHelpers.getCategories();
  blogHelpers.getBlogs().then((blogs) => {
    res.render('blogs/index', { blogs, categories, categoryDetails, active: { index: true } });
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


router.get('/category', async (req, res) => {
  let recentBlogs = await blogHelpers.getRecentBlogs()
  let categories = await adminHelpers.getCategories(); //includes category details for nav bar
  let categoryDetails = await blogHelpers.getCategoryCount(); //Includes category count for category list side-bar

  blogHelpers.getCategoryBlogs(req.query.id, req.query.page).then((response) => {
    blogCount = response.blogCount
    blogs = response.sortedBlogs
    activeCategory = blogs[0].category
    for (i = 0; i < categories.length; i++) {
      categories[i].activeCategory = activeCategory
    }

    // Pagenation Codes    
    categoryId = req.query.id
    currentPage = +req.query.page || 1;
    const itemsPerPage = 1;
    let hasNextPage = ((itemsPerPage * currentPage) < blogCount) ? true : false
    let hasPreviousPage = (currentPage > 1) ? true : false
    let nextPage = currentPage + 1;
    let previousPage = currentPage - 1;
    let lastPage = Math.ceil(blogCount / itemsPerPage)
    // /pagenation
    res.render('blogs/category', { blogs, recentBlogs, categories, categoryDetails, hasNextPage, hasPreviousPage, nextPage, previousPage, lastPage, currentPage, categoryId })
  })
})

// Post routes
router.get('/read-blog', async (req, res) => {
  // console.log('---------------------req.query.id',req.query.category)
  let readNext = await blogHelpers.getReadNextBlogs(req.query.category)
  let categories = await adminHelpers.getCategories(); //includes category details for nav bar
  let categoryDetails = await blogHelpers.getCategoryCount(); //Includes category count for category list side-bar
  adminHelpers.getBlogDetails(req.query.id).then((blog) => {
    res.render('blogs/posts', { blog, categories, categoryDetails, readNext, active: { index: true } })
  })
})



module.exports = router;