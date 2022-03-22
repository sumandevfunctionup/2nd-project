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
      const requestBody = req.body
      if (!isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college detalls' })
        return
      }

  const {name,fullName,logoLink}=requestBody

      //  checking if any data field is empty or has no value
      if( !isValid(name) )    return res.status(400).send({ status : false, msg: 'please provide name'})
      if( !isValid(fullName) )    return res.status(400).send({ status : false, msg: 'please provide full name'})    
      if( !isValid(logoLink) )    return res.status(400).send({ status : false, msg: 'please provide logo link'})

      //checking name is taken or not
    const nameCheck= await collegeModel.findone({name})
    if(nameCheck) return res.status(400).send({status:false,message:'name is already used'})
   
    const regex = /^([a-z]+)$/;
    if(!regex.test(name)) return res.status(400).send({status:false,message:'please enter name in lower case'})


    requestBody["name"]= name.trim()
    requestBody["fullName"]= fullName.trim()
    requestBody["logoLink"]= logoLink.trim()

      const createCollege = await collegeModel.create(requestBody)
      res.status(201).send({ status:true,message:"Created Successfully" ,data: createCollege })
    }
    catch (err) {
      console.log(err)
      res.status(500).send({ msg: err.message })
    }
  }
  module.exports.createCollege =createCollege 
  

  //---------------------------------------------------------------------------------------------------------------------//
  const  collegeDetails = async function(req,res){
       try{
          
        const  queryParams = req.query
        if(!isValid(queryParams)) {
         res.status(400).send({status:false,message:"'Invalid request parameters. Please provide details' "})
        }
        const collegeName = req.query.collegeName
        if(!isValid(collegeName)) {
          res.status(400).send({status:false,message:"'Invalid request parameters. Please provide collegeName' "})
         }

        const details = await collegeModel.find({name:collegeName,isDeleted:false})
        if(!details){
          res.status(400).send({status:false,message:"please provide valid collegeName"})
        }
        const collegeId = details._id
        const internDetails = await internModel.find({collegeId:collegeId,isDeleted:false})
        if(!internDetails){
          res.status(404).send({status:false,message:"no intern found"})
        }


        const finalData= {
          "name":details.name,
          "fullName":details.fullName,
          "logoLink":details.logoLink,
          "interests":internDetails
        }

        res.status(200).send({status:true,data:finalData})


       }catch(error){
         res.status(500).send({status:false,message:error.message})
       }

  }