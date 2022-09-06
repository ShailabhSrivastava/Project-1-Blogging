const BlogModel = require("../Model/BlogModel")
const authorModel = require("../Model/authorModel")

const createBlogs = async function (req, res) {
    try {
        let data = req.body
        let author= await authorModel.findById(data.author_id)
        if (!author){
            res.status(404).send({msg: "author ID is not valid", status:false})
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
        const blogData = req.body
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



module.exports.createBlogs=createBlogs
module.exports.updateBlog=updateBlog
