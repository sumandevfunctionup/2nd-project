const collegeModel = require("../models/collegeModel")
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
  
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }
  const createIntern = async function (req, res) {
    try {
        const requestBody = req.body

        if(!isValidRequestBody(requestBody)){
          res.status(400).send({status:false,message:'Invalid request parameters. Please provide college detalls' })
        }

        const {name,email,mobile,collegeName}=requestBody
        if(!isValid(name)){
          res.status(400).send({status:false,message:'please enter name' })
        }
        if(!isValid(email)){
          res.status(400).send({status:false,message:'please enter email' })
        }
        if(!isValid(mobile)){
          res.status(400).send({status:false,message:'please enter mobile' })
        }
        if(!isValid(collegeName)){
          res.status(400).send({status:false,message:'please enter collegename' })
        }

      
    
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          return res.status(400).send({
              status: false, message: `${email} is not a valid email`,
          });
      }
    
      const checkEmail = await internModel.findOne({ email, isDeleted: false });
      if (checkEmail) {
          return res.status(400).send({ status: false, message: `${email} is already registered` });
      }


      if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
        return res.status(400).send({
            status: false, message: `${mobile} is not a valid mobile number`,
        });
    }
    const checkNumber = await internModel.findOne({ mobile, isDeleted: false });
      if (checkNumber) {
          return res.status(400).send({ status: false, message: `${mobile} is already registered` });
      }


      const  findCollegeId= await collegeModel.find({name:collegeName,isDeleted:false})
      if(!findCollegeId){
        res.send(404).status({status:false,message:"no colleges found"})
      }

      const collegeId = findCollegeId._id
      requestBody["collegeId"] = collegeId

      const internCreation = await internModel.create({requestBody})
      res.status(200).send({status:true,message:"successfully created",data:internCreation})
    
    }catch(error){
      res.status(500).send({status:false,message:error.message})
    }
  }
  module.exports.createIntern =createIntern