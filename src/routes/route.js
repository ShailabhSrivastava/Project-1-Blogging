const express = require('express');
const router = express.Router();
const authorController= require('../controller/authorController')
const BlogsController= require('../controller/BlogsController')
const jwt = require("jsonwebtoken")
const middleware= require("../middleware/auth")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
 

router.get ("/blogs",function(req,res) {
res.send("this is second api")
})


router.post("/authors", authorController.createAuthor)
router.get("/blog", middleware.authentication, BlogsController.getBlogs)
router.post("/Blogs", BlogsController.createBlogs)        
router.put("/blogs/:blogId", middleware.authentication, middleware.authorization,BlogsController.updateBlog)
router.delete("/blogs/:blogId", middleware.authentication, middleware.authorization, BlogsController.deleteBlogs)
router.post("/login", authorController.loginUser)        
router.delete("/blog",middleware.authentication, BlogsController.deleteQueryParams)      

module.exports = router;    