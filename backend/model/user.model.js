const mongoose  = require('mongoose')
const { type } = require('node:os')

const userSchema = new mongoose.Schema({
    name:{
        type:String,

    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
},
    resetToken:String,
    resetTokenExpiry:String,
    image:{
        url:String,
        public_id:String
    }


})

module.exports = mongoose.model('User',userSchema)