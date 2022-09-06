const BlogModel = require("../Model/BlogModel")
const authorModel = require("../Model/authorModel")
const mongoose = require('mongoose');

const createBlogs = async function (req, res) {
    try {
        let data = req.body
        let author = await authorModel.findById(data.authorId)
        if (!author) {
            res.status(404).send({ msg: "author ID is not valid", status: false })
        }
        let savedData = await BlogModel.create(data)
        return res.status(201).send({ msg: savedData })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: err.message })
    }
}

let getBlogs = async function (req, res) {

    try {

        let filter = { isDeleted: false, isPublished: true }
        let queryValue = req.query

        //======================================= Start Validation===============================================//

        if (queryValue["author Id"]) {

            if (typeof queryValue["author Id"] !== "string" || typeof queryValue["author Id"] == "undefined") {
                return res.status(400).send({ msg: "authorId is required", status: false })
            }
            if (queryValue["author Id"].length == 0) {
                return res.status(400).send({ msg: "authorId must be present", status: false })
            }
            if (!mongoose.Types.ObjectId.isValid(queryValue["author Id"])) {
                return res.status(400).send({ msg: "authorId is is invalid", status: false })
            }

            let author = await authorModel.findById(queryValue["author Id"])

            if (!author) {
                return res.status(404).send({ msg: "athorId is not from author collection", status: false })
            }

            filter["authorId"] = queryValue["author Id"]
        }
        if (queryValue["category"]) {

            if (typeof queryValue["category"] !== "string" || typeof queryValue["category"] == "undefined") {
                return res.status(400).send({ msg: "category is required", status: false })
            }

            filter["category"] = queryValue["category"]
        }
        if (queryValue["tags"]) {

            filter["tags"] = queryValue["tags"]
        }
        if (queryValue["subscategory"]) {

            filter["subscategory"] = queryValue["subscategory"]
        }

        let data = await BlogModel.find(filter)

        if (data.length == 0) {

            return res.status(404).send({ status: false, msg: "No document found" })
        }

        res.status(200).send({ data: data })

    } catch (err) {

        res.status(500).send({ status: false, msg: err.message })
    }
}


const updateBlog = async function (req, res) {
    try {
        const blogData = req.params  
        let BLOG = req.params.blogId
        if (!mongoose.isValidObjectId(BLOG)){ return res.status(404).send({ status: false, data: "ID not Found in path param" })}
        let blog = await BlogModel.findOneAndUpdate(
            { isDeleted: false },
            {
                $set: { isPublished: true, body: blogData.body, title: blogData.title, publishedAt: new Date() },
                $push: { tags: blogData.tags, subcategory: blogData.subcategory }
            },
            { new: true });
        return res.status(200).send({ status: true, data: blog });  
    }
    catch (error) {  
        console.log(error) 
        return res.status(500).send({ status: false, Error: error.message })
    }
  
}


const deleteBlogs = async function (req, res) {

    try {
        let data = req.params
        console.log(data)
        let BLOG = req.params.blogId
        if (!mongoose.isValidObjectId(BLOG)){ return res.status(404).send({ status: false, data: "ID not Found in path param" })}
        let deletedBlog = await BlogModel.findOneAndUpdate({ isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
        res.status(200).send({ status: true, msg: deletedBlog })
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })  
    }
}  

  

module.exports.createBlogs = createBlogs
module.exports.getBlogs=getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlogs=deleteBlogs
