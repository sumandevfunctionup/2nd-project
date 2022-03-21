const collegeModel = require("../models/collegeModel")
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
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }
  
  const createCollege = async function (req, res) {
    try {
      const data = req.body
      if (!isValidRequestBody(data)) {
        res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college detalls' })
        return
      }

  
     
  const {name,fullName,logoLink}=data
      //  checking if any data field is empty or has no value
      if( !isValid(data.name) )    return res.status(400).send({ status : false, msg: 'please provide name'})
      if( !isValid(data.fullName) )    return res.status(400).send({ status : false, msg: 'please provide full name'})    
      if( !isValid(data.logoLink) )    return res.status(400).send({ status : false, msg: 'please provide logo link'})
      //checking name is taken or not
    const nameCheck= await collegeModel.findone({name})
    if(nameCheck) return res.status(400).send({status:false,message:'name is already used'})
    //checking lowercase
    //const regex = /^([a-z]+)$/;
    //if(!regex.test(name)) return res.status(400).send({status:false,message:'please enter name in lower case'})

      const createCollege = await collegeModel.create(data)
      res.status(201).send({ data: createCollege })
    }
    catch (err) {
      console.log(err)
      res.status(500).send({ msg: err.message })
    }
  }
  module.exports.createCollege =createCollege 