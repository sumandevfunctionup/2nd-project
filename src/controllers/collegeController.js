const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")


const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (value.trim().length == 0) {
    return false
  } if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
}
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

const createCollege = async function (req, res) {
  try {
    let requestBody = req.body
    if (!isValidRequestBody(requestBody)) {
       return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college detalls' })

    }
    let { name, fullName, logoLink } = requestBody

    // removeing any space
    requestBody["name"] = name.toLowerCase().trim()   // changing any upperCase letter to lowerCase 
    requestBody["fullName"] = fullName.trim()
    requestBody["logoLink"] = logoLink.trim()



    //  checking if any data field is empty or has no value
    if (!isValid(name)) return res.status(400).send({ status: false, msg: 'please provide name' })
    if (!isValid(fullName)) return res.status(400).send({ status: false, msg: 'please provide full name' })
    if (!isValid(logoLink)) return res.status(400).send({ status: false, msg: 'please provide logo link' })

    //checking name is taken or not
    const trimedName= name.trim()
    const nameCheck = await collegeModel.findOne({ name:trimedName })
    if (nameCheck) return res.status(400).send({ status: false, message: 'name is already used' })

    const createCollege = await collegeModel.create(requestBody)
    res.status(201).send({ status: true, message: "Created Successfully", data: {name:createCollege.name,fullName:createCollege.fullName,logoLink:createCollege.logoLink  } })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}
module.exports.createCollege = createCollege


//---------------------------------------------------------------------------------------------------------------------//

const collegeDetails = async function (req, res) {
  try {

    const queryParams = req.query
    if (!queryParams) {
     return  res.status(400).send({ status: false, message: "'Invalid request parameters. Please provide details' " })
    }
    const collegeName = req.query.collegeName
    if (!isValid(collegeName)) {
       return res.status(400).send({ status: false, message: "'Invalid request parameters. Please provide collegeName' " })
    }

    // checking collegeName exist or not
    const details = await collegeModel.find({ name: collegeName, isDeleted: false })
    if (!details.length) {
     return  res.status(400).send({ status: false, message: "please provide valid collegeName" })
    }
    console.log(details)
    const collegeId = details[0]._id
    const internDetails = await internModel.find({ collegeId: collegeId, isDeleted: false }).select({createdAt:0,updatedAt:0,__v:0})
    if (!internDetails.length) {
     return   res.status(404).send({ status: false, message: "no intern found" })

    }


    const finalData = {
      "name": details[0].name,
      "fullName": details[0].fullName,
      "logoLink": details[0].logoLink,
      "interests": internDetails
    }

    res.status(200).send({ status: true, data: finalData })


  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }

}
module.exports.collegeDetails = collegeDetails 