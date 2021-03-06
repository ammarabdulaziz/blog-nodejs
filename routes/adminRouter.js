const { response } = require('express');
const fs = require('fs')
var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-Helpers')
const isAdmin = require('../config/auth').isAdmin
const isNotAdmin = require('../config/auth').isNotAdmin


router.get('/', function (req, res, next) {
  res.redirect('admin/view-blogs');
});

router.get('/logout', isAdmin, (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

// Blog Routes
router.get('/view-blogs', isAdmin, function (req, res, next) {
  let blogs = adminHelpers.getBlogs().then((blogs) => {
    res.render('admin/admin-blogs/view-blogs', { admin: true, blogs , active: {blogView: true }});
  })
});

router.get('/add-new-blog', isAdmin, (req, res) => {
  adminHelpers.getCategories().then((categories) => {
    res.render('admin/admin-blogs/add-blog', { admin: true, categories , active: {blogView: true }})
  })
})

router.post('/add-new-blog', isAdmin, (req, res) => {
  console.log(req.body)
  console.log(req.files.image);

  adminHelpers.addBlog(req.body, (id) => {
    let image = req.files.image
    image.mv('./public/blog-images/' + id + '.png', (err, done) => {
      if (!err) {
        res.redirect('/admin/view-blogs');
      } else {
        console.log(err)
      }
    })
  })
})

router.get('/delete-blog', isAdmin, (req, res) => {
  let blogId = req.query.id;
  adminHelpers.deleteBlog(blogId).then((response) => {
    const path = './public/blog-images/' + blogId + '.png'
    try {
      fs.unlinkSync(path)
    } catch (err) {
      console.error('------file delete error', err)
    }
    res.redirect('/admin')
  })
})

router.get('/edit-blog', isAdmin, async (req, res) => {
  let categories = await adminHelpers.getCategories()
  adminHelpers.getBlogDetails(req.query.id).then((blog) => {
    console.log(blog)
    res.render('admin/admin-blogs/edit-blog', { admin: true, blog, categories, active: {blogView: true }})
  })
})

router.post('/edit-blog', isAdmin, (req, res) => {
  adminHelpers.editBlog(req.query.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/blog-images/' + req.query.id + '.png')
    }
  })
})

router.get('/read-blog', isAdmin, (req, res) => {
  adminHelpers.getBlogDetails(req.query.id).then((blog) => {
    res.render('admin/admin-blogs/read-blog', { admin: true, blog , active: {blogView: true }})
  })
})

// Category Routes
router.get('/add-category', isAdmin, (req, res) => {
  res.render('admin/admin-category/add-category', { admin: true , active: {categoryView: true }})
})

router.post('/add-category', isAdmin, (req, res) => {
  adminHelpers.addCategory(req.body).then(() => {
    res.redirect('/admin/view-categories')
  })
})

router.get('/view-categories', isAdmin, (req, res) => {
  adminHelpers.getCategories().then((categories) => {
    res.render('admin/admin-category/view-category', { admin: true, categories , active: {categoryView: true }})
  })
})

router.get('/delete-category', isAdmin, (req, res) => {
  adminHelpers.deleteCategory(req.query.id).then((response) => {
   res.redirect('/admin/view-categories')
  })
})

router.get('/edit-category', isAdmin, (req, res) => {
  adminHelpers.getCategoryDetails(req.query.id).then((category) => {
    res.render('admin/admin-category/edit-category', { admin: true, category , active: {categoryView: true }})
  })
})

router.post('/edit-category', isAdmin, (req, res) => {
  adminHelpers.editCategory(req.query.id, req.body).then(() => {
    res.redirect('/admin/view-categories')
    })
})


module.exports = router;