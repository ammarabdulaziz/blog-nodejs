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
        db.get().collection(collections.BLOG_COLLECTION).insertOne(blogDetails).then((data) => {
            // console.log(data);
            callback(data.ops[0]._id);
        })
    }

}