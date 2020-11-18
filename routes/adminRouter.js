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

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

// Blog Routes
router.get('/view-blogs', function (req, res, next) {
  let blogs = adminHelpers.getBlogs().then((blogs) => {
    res.render('admin/admin-blogs/view-blogs', { admin: true, blogs });
  })
});

router.get('/add-new-blog', (req, res) => {
  res.render('admin/admin-blogs/add-blog', { admin: true })
})

router.post('/add-new-blog', (req, res) => {
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

router.get('/delete-blog', (req, res) => {
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

router.get('/edit-blog', (req, res) => {
  adminHelpers.getBlogDetails(req.query.id).then((blog) => {
    res.render('admin/admin-blogs/edit-blog', { admin: true, blog })
  })
})

router.post('/edit-blog', (req, res) => {
  adminHelpers.editBlog(req.query.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/blog-images/' + req.query.id + '.png')
    }
  })
})

router.get('/read-blog', (req, res) => {
  adminHelpers.getBlogDetails(req.query.id).then((blog) => {
    res.render('admin/admin-blogs/read-blog', { admin: true, blog })
  })
})

// Category Routes
router.get('/add-category', (req, res) => {
  res.render('admin/admin-category/add-category', { admin: true })
})

router.post('/add-category', (req, res) => {
  adminHelpers.addCategory(req.body).then(() => {
    res.redirect('/admin/view-categories')
  })
})

router.get('/view-categories', (req, res) => {
  adminHelpers.getCategories().then((categories) => {
    console.log('----------categories----',categories)
    res.render('admin/admin-category/view-category', { admin: true, categories })
  })
})

router.get('/delete-category', (req, res) => {
  adminHelpers.deleteCategory(req.query.id).then((response) => {
   res.redirect('/admin/view-categories')
  })
})

router.get('/edit-category', (req, res) => {
  adminHelpers.getCategoryDetails(req.query.id).then((category) => {
    res.render('admin/admin-category/edit-category', { admin: true, category })
  })
})

router.post('/edit-category', (req, res) => {
  adminHelpers.editCategory(req.query.id, req.body).then(() => {
    res.redirect('/admin/view-categories')
    })
})


module.exports = router;