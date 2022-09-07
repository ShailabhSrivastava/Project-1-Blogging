const author = require("../Model/authorModel")
const blog= require("../Model/BlogModel")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

const mid1 = async function (req, res, next) {
    try{
    let token = req.headers["x-auth-token"]
    if (!token) return res.status(401).send({ msg: "token must be present", status: false })
    // console.log(token)
    let decodeToken = jwt.verify(token, "P1@roject")
    if (!decodeToken) return res.status(500).send({ msg: "token is inValid", status: false })
    // console.log(decodeToken)
    next()
} catch (err) {
    res.status(500).send({msg:"ERROR", error: err.message})  
}    
} 

const authorization = async function (req, res, next) {
    try{
        let token = req.headers["x-auth-token"]
    if (!token) return res.status(401).send({ msg: "token must be present", status: false })
    let blogId= req.params.blogId
    let author= await blog.findById(blogId).select({authorId:1, _id:0})
    let userToBeModified= author.authorId.toString()
    console.log(userToBeModified)  
    let decodeToken = jwt.verify(token, "P1@roject")
    let userLoggedIn = decodeToken.userId.toString()
    console.log(userLoggedIn)
    if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
    next()
    } catch (err) {
        res.status(500).send({msg:"ERROR", error: err.message})    
    }     
}

module.exports.mid1 = mid1
module.exports.authorization=authorization