var db = require('../config/connection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const { response } = require('express')
const { Forbidden } = require('http-errors')

module.exports = {

    doRegister: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collections.ADMIN_COLLECTION).insertOne(userData).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },

    addBlog: (blogDetails, callback) => {
        // console.log(product);
        var today = new Date();
        let month = today.toLocaleString('default', { month: 'short' });
        let year = today.getFullYear();
        let day = today.getDate();
        let hours = today.getHours();
        let minutes = today.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        let date = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`

        blogDetails.date = date;
        db.get().collection(collections.BLOG_COLLECTION).insertOne(blogDetails).then((data) => {
            callback(data.ops[0]._id);
        })
    },

    getBlogs: () => {
        return new Promise(async (resolve, reject) => {
            let blogs = await db.get().collection(collections.BLOG_COLLECTION).find().sort({ date: -1 }).toArray()
            resolve(blogs)
        })
    },

    deleteBlog: (blogId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.BLOG_COLLECTION).removeOne({ _id: objectId(blogId) }).then((response) => {
                resolve(response)
            })
        })
    },

    getBlogDetails: (blogId) => {
        return new Promise(async (resolve, response) => {
            let blog = await db.get().collection(collections.BLOG_COLLECTION).findOne({ _id: objectId(blogId) })
            resolve(blog)
        })
    },

    editBlog: (blogId, editedBlog) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.BLOG_COLLECTION).updateOne({ _id: objectId(blogId) }, {
                $set: {
                    title: editedBlog.title,
                    blog: editedBlog.blog,
                    category: editedBlog.category
                }
            }).then((respone) => {
                resolve()
            })
        })
    },

    // Category helpers
    addCategory: (category) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CATEGORY_COLLECTION).insertOne(category).then(() => {
                resolve()
            })
        })
    },

    getCategories: () => {
        return new Promise(async (resolve, reject) => {
            let categories = await db.get().collection(collections.CATEGORY_COLLECTION).find().toArray()
            resolve(categories)
        })
    },

    deleteCategory: (categoryId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CATEGORY_COLLECTION).removeOne({ _id: objectId(categoryId) }).then((response) => {
                resolve(response)
            })
        })
    },

    getCategoryDetails: (categoryId) => {
        return new Promise(async (resolve, response) => {
            let category = await db.get().collection(collections.CATEGORY_COLLECTION).findOne({ _id: objectId(categoryId) })
            resolve(category)
        })
    },

    editCategory: (categoryId, editedCategory) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CATEGORY_COLLECTION).updateOne({ _id: objectId(categoryId) }, {
                $set: {
                    category: editedCategory.category
                }
            }).then((respone) => {
                resolve()
            })
        })
    }
}