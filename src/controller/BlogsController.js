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
        if (data.title==undefined){
            return res.status(401).send({msg:"title Compulsory"})
         }
         if (data.body==undefined){
            return res.status(401).send({msg:"body Compulsory"})
         }
        let savedData = await BlogModel.create(data)
        return res.status(201).send({ msg: savedData })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: err.message })
    }
}


    const getBlogs = async function (req, res) {
        try {
    
            let allQuery = req.query
            let blogsDetail = await BlogModel.find(({ $and: [allQuery, { isDeleted: false }, { isPublished: true }] }))
            if (blogsDetail == false)
                res.status(404).send({ status: false, msg: "data not found" })
            else
                res.status(200).send({ status: true, data: blogsDetail })
        }
        catch (err) {
            res.status(500).send({ status: false, msg: err.message })  
        }
    }



const updateBlog = async function (req, res) {
    try {
        const blogData = req.body
        let BLOG = req.params.blogId
        if (!mongoose.Types.ObjectId.isValid(BLOG)) { return res.status(404).send({ status: false, data: "ID not Found in path param" }) }
        let blog = await BlogModel.findOneAndUpdate( 
            { isDeleted: false, _id: BLOG },
            {
                $set: { isPublished: true, body: blogData.body, title: blogData.title, publishedAt: new Date() },
                $push: { tags: blogData.tags, subcategory: blogData.subcategory }
            },
            { new: true });
        return res.status(200).send({ status: true, data: blog });
    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }

}


const deleteBlogs = async function (req, res) {

    try {
        let data = req.params
        let BLOG = req.params.blogId
        if (!mongoose.isValidObjectId(BLOG)) { return res.status(404).send({ status: false, data: "ID not Found in path param" }) }
        let deletedBlog = await BlogModel.findOneAndUpdate({ isDeleted: false, _id: BLOG }, { isDeleted: true, deletedAt: new Date() }
            , { new: true });
        res.status(200).send({ status: true, msg: deletedBlog })
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}








const deleteQueryParams = async function (req, res) {
    try {
        const data = req.query
        const filterQuery = { isPublished:false, isDeleted: false}
        let { authorId, category, subcategory, tags, isPublished } = data 
        if (Object.keys(data).length==0) {
            return res.status(400).send({msg:"Pls Provide atleast one filter"})
        }   
        if (authorId){
            if (authorId == req.decodeToken.userId){
                filterQuery["authorId"] = authorId
            } else {
                return res.status(404).send({msg: "user is not authorised for this operation"})
            }
        } else {
            filterQuery["authorId"] = req.decodeToken.userId
        }
        if (category) {
            filterQuery["category"] = category 
        }
        if (subcategory) {
            filterQuery["subcategory"] = subcategory
        }
        if (tags) {
            filterQuery["tags"] = tags
        }
        const deletedBlogs1 = await BlogModel.updateMany(filterQuery, { $set: { isDeleted: true, deletedAt: new Date() } })
        if (deletedBlogs1.modifiedCount==0){
            return res.send({msg:"Document not found"})
        }
        return res.status(200).send({ status: true, msg: deletedBlogs1})
 
     }
 
     catch (err) {
         res.status(500).send({ status: false, msg: err.message });
     }
 }


module.exports.createBlogs = createBlogs 
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlogs = deleteBlogs
module.exports.deleteQueryParams=deleteQueryParams
