const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ObjectId = mongoose.Schema.Types.ObjectId

const BlogSchema = new mongoose.Schema({
    
title:{
    type: String,
    required:true
},
body: {
    type:String,
    required:true

},

author_id:{
    type: ObjectId,
    required: true,
    ref: "authorProject"
},
tags:
    [String]
,
category:{
    type:String,
    required:true
},

subcategory:{
    type:String

},
isDeleted: {
    type: Boolean,
    default: false
},
isPublished: {
    type: Boolean,
    default: false
}

// deletedAt: Date,
// publishedAt: Date
},


 { timestamps: true });




module.exports = mongoose.model('BlogProject', BlogSchema)





