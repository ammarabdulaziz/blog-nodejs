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
    },

    getCategoryBlogs: (categoryId, reqPage) => {
        return new Promise(async (resolve, reject) => {
            const itemsPerPage = 1;
            const page = +reqPage || 1; // pagination
            let response = {}
            let category = await db.get().collection(collections.CATEGORY_COLLECTION).findOne({ _id: objectId(categoryId) })
            category = category.category
            var blogCount = await db.get().collection(collections.BLOG_COLLECTION).find({ category: category }).count()
            let sortedBlogs = await db.get().collection(collections.BLOG_COLLECTION).find({ category: category }).sort({ date: -1 })
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage).toArray()

            response.blogCount = blogCount
            response.sortedBlogs = sortedBlogs
            resolve(response)
        })
    },

    getRecentBlogs: () => {
        return new Promise(async (resolve, reject) => {
            let recentBlogs = await db.get().collection(collections.BLOG_COLLECTION).find().sort({ date: -1 }).limit(4).toArray()
            resolve(recentBlogs)
        })
    },

    getCategoryCount: () => {
        return new Promise(async (resolve, reject) => {
            let categoryDetails = await db.get().collection(collections.BLOG_COLLECTION).aggregate([
                {
                    $project: {
                        _id: 0,
                        category: 1
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'category',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'categoryLookup'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        count: 1,
                        categoryLookup: { $arrayElemAt: ['$categoryLookup', 0] }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]).toArray()
            resolve(categoryDetails)
        })
    },

    getReadNextBlogs: (categoryName) => {
        return new Promise(async (resolve, reject) => {
            // let category = await db.get().collection(collections.CATEGORY_COLLECTION).find({ category: categoryName })
            // category = category.category
            let readNextBlogs = await db.get().collection(collections.BLOG_COLLECTION).find({ category: categoryName }).sort({ date: -1 }).limit(4).toArray()
            resolve(readNextBlogs)
        })
    }
}

