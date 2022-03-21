const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = new mongoose.Schema( {
    name : {
        type : String ,
        required : true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    mobile:{
        type:Number,
        unique:true,
        required:true,
    },
    collegeId : {
        type : ObjectId ,
        ref : "college" ,
        required : true
    } ,
    isDeleted:{
        type:Boolean,
        default:false
    }
 } ,{ timestamps: true });
 module.exports = mongoose.model('intern', internSchema)