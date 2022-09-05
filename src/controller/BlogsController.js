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
module.exports.createBlogs=createBlogs
