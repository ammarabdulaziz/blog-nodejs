const { response } = require('express');
const fs = require('fs')
var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-Helpers')
const isAdmin = require('../config/auth').isAdmin
const isNotAdmin = require('../config/auth').isNotAdmin

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.redirect('admin/view-blogs');
});

router.get('/view-blogs', function (req, res, next) {
  let blogs = adminHelpers.getBlogs().then((blogs) => {
    // console.log(blogs)
    res.render('admin/admin-blogs/view-blogs', { admin: true, blogs });
  })
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

// Add post routes
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
      console.error('------file delete error',err)
    }
    res.redirect('/admin')
  })
})

router.get('/edit-blog', (req, res) => {
  adminHelpers.getBlogDetails(req.query.id).then((blog) => {
    console.log(blog)
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


module.exports = router;
