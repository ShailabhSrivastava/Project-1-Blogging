const BlogModel = require("../Model/BlogModel")
const authorModel = require("../Model/authorModel")

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


const updateBlog = async function (req, res) {
    try {
        const blogData = req.params
        // let BLOG = req.params.blogId
        // if (!BLOG) return res.status(404).send({ status: false, data: "ID not Found in path param" })
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
        let blog = await BlogModel.findById()
        if (blog.isDeleted === true) {
            return res.status(404).send({ status: false, message: "No such blogId exists" })
        }
        let deletedBlog = await BlogModel.findOneAndUpdate({ isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
        res.status(200).send({ status: true, msg: deletedBlog })
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })  
    }
}  

  

module.exports.createBlogs = createBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlogs=deleteBlogs
