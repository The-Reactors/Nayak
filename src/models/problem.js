const mongoose = require('mongoose')
const validator = require('validator')

const problemSchema = new mongoose.Schema({

    title : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    priority : {
        type: String,
        required: true,
    },
    status : {
        type: String,
        required: true,
    },
    category : {
        type: String,
        required: true,
    },
    kind : {
        type: String,
        required: true,
    },
    creatorId : {
        type: String,
        required: true,
    },
    location:{
        type:String,
        required:true,
    },
    latitude:
    {
        type:String,
        required:true,
    },
    upvotes:
    {
        default:0,
        type:Number,
        
    },
    downvotes:
    {
        type:Number,
        default:0,
    },
    longitude:
    {
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    images:[{
        type: Buffer
    }],
    

})

const Problem = mongoose.model('Problem', problemSchema)

module.exports = Problem