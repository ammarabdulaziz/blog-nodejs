var db = require('../config/connection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const { response } = require('express')
const { Forbidden } = require('http-errors')

module.exports = {
    getBlogs: () => {
        return new Promise(async (resolve, reject) => {
            let blogs = await db.get().collection(collections.BLOG_COLLECTION).find().sort({ date: -1 }).limit(6).toArray()
            resolve(blogs)
        })
    }
}