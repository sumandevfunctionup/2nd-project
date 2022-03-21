const internModel = require("../models/internModel")
const isValid= function(value){
    if( typeof (value)=== 'undefined' || typeof (value)=== 'null'){
        return false
    } 
    if(value.trim().length==0){
        return false
    } if(typeof (value) === 'string' && value.trim().length >0 ){
        return true
    }
  }
  const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
  }
  const createIntern = async function (req, res) {
    try {
        const data = req.body
        const collegeName = req.body.collegeId

        if (!Object.keys(data).length > 0) return res.status(400).send({ error: "Please enter data" })}