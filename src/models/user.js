const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    googleId:{
        type:String,
        required:false
    },
    profilePicLink:{
        type:String,
        required:false  
    },
    profilePic:{
        type:Buffer,
        required:false
    },
    phoneNo:{
        type:Number,
        required: false
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is Invalid')
            }
        }
    },
    password: {
        type: String,
        required: false,
        trim: true,
        minlength:6
    },
    notificationList: [{
        notifierName:{
            type:String
        },
        problemTitle:{
            type:String
        },
        action:{
            type:String
        }
    }],

    upvoteProblemsList: {
        
        type:[],
        default:[0]
    },
    downvoteProblemsList: {
        type:[],
        default:[0]
        
    }
    
})

userSchema.pre('save', async function (next) {

    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User