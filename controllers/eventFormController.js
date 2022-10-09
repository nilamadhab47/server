const eventModel = require("../models/eventSchema")
const aws = require("../middleware/aws")
const mongoose = require('mongoose')


const isValidFile = function(files){
   let imageRegex = /.*\.(jpeg|jpg|png)$/; 
   return imageRegex.test(files)
}

let isValidObjectId = function (ObjectId){
   return mongoose.Types.ObjectId.isValid(ObjectId)
   }

///////////// CREATE EVENT /////////////////////

const createEvent = async function(req,res){

   try{
   let data = req.body

      if (Object.keys(data).length == 0){
         return res.status(400).send({ status: false,msg:"Please enter data in form"}) 
   }

let files = req.files;

if (files.length == 0)  return res.status(400).send({ status: false, message: "Please provide image" })
if(!isValidFile(files[0].originalname))  return res.status(400).send({ status: false, message: "Please provide image only" })
if(!isValidFile(files[1].originalname))  return res.status(400).send({ status: false, message: "Please provide Mobile image only" })


   if(!data.eventName  || typeof(data.eventName) != "string"){
      return res.status(400).send({ status: false,msg:"Event name fields is empty "})
   }

   if(!data.title || typeof(data.title) != "string"){
      return res.status(400).send({ status: false,msg:"Title is required in string"})
   }

   if(!data.subTitle  || typeof(data.subTitle) != "string"){
      return res.status(400).send({ status: false,msg:"Sub-title is required in string"})
   }

   if(!data.eventLink  || typeof(data.eventLink) != "string"){
      return res.status(400).send({ status: false,msg:"Event link should be valid and required"})
   }
      let reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
     if(!(reg.test(data.eventLink))){
     return res.status(400).send({ status: false,msg:"Enter a valid link"})
     }

   if(!data.price ){
      return res.status(400).send({ status: false,msg:"price is required in number"})
   }

   if(!data.showStartHour){
      return res.status(400).send({ status: false,msg:"Show start hour is required in number"})
   }

   if(!data.showStartMinute){
      return res.status(400).send({ status: false,msg:"Show start minute is required in number"})
   }

   if(!data.showStartZone){
      return res.status(400).send({ status: false,msg:"show start zone is required in string [AM or PM]"})
   }

   if(!data.doorOpenHour){
      return res.status(400).send({ status: false,msg:"Door open hour is required in number"})
   }

   if(!data.doorOpenMinute){
      return res.status(400).send({ status: false,msg:"Door open minute is required in number"})
   }

   if(!data.doorOpeningZone){
      return res.status(400).send({ status: false,msg:"Door opening zone is required in string [AM or PM]"})
   }

   if(!data.date){         ////////////////////////// DATE VALIDATION LEFT /////////////////////
      return res.status(400).send({ status: false,msg:"Date is required in format-[yyyy-mm-dd]"})
   }

   if(!data.eventStartHour ){
      return res.status(400).send({ status: false,msg:"Event start hour is required in number"})
   }

   if(!data.eventStartMinute){
      return res.status(400).send({ status: false,msg:"Event start minute is required in minute"})
   }

   if(!data.eventStartZone  || typeof(data.eventStartZone) != "string"){
      return res.status(400).send({ status: false,msg:"Event start zone is required in string [AM or PM]"})
   }

   if(!data.eventEndHour){
      return res.status(400).send({ status: false,msg:"Event end hour is required in number"})
   }

   if(!data.eventEndMinute){
      return res.status(400).send({ status: false,msg:"event end minute is required in number"})
   }

   if(!data.eventEndZone){
      return res.status(400).send({ status: false,msg:"event end zone is required in string [AM or PM]"})
   }

   if(!data.eventStartDate){
      return res.status(400).send({ status: false,msg:"Event start date is required in format-[yyyy-mm-dd]"})
   }

   if(!data.eventEndDate){
      return res.status(400).send({ status: false,msg:"Event end date is required in format-[yyyy-mm-dd]"})
   }
    
        const uploadedFileURL = await aws.uploadFile(files[0])
        data.uploadMainImage= uploadedFileURL;
        let image2 = []
        const uploadedFileURL1 = await aws.uploadFile(files[1])
        image2=uploadedFileURL1
        data.uploadMobileImage= image2;

        if(!data.uploadMainImage){
         return res.status(400).send({ status: false,msg:"Upload Main Image "})}
      if(!data.uploadMobileImage){
         return res.status(400).send({ status: false,msg:"Upload Mobile Image "})}

   let createdData = await eventModel.create(data)
  return res.status(200).send({status:true,msg:"Event created succesfully",eventData:createdData})
}

catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
}

}

/////////////GET EVENTS//////////////////

const getAllEvents = async function(req,res){
   try{
   let getEvent = await eventModel.find({isDeleted:false}).select({uploadMainImage:1,uploadMobileImage:1,eventName:1,price:1,eventStartDate:1,eventEndDate:1,_id:1,title:1,subTitle:1,eventLink:1,showStartHour:1,showStartMinute:1,showStartZone:1,doorOpenHour:1,doorOpenMinute:1,doorOpeningZone:1,date:1,eventStartHour:1,eventStartMinute:1,
      eventStartZone:1,eventEndHour:1,eventEndMinute:1,eventEndZone:1,eventStartDate:1,eventEndDate:1
   })

   if(getEvent.length==0){
      return res.status(400).send({ status: false,msg:"No Events found"})
   }
  return res.status(200).send({status:true,eventData:getEvent})
}
catch (error) {
   return res.status(500).send({ status: false, msg: error.message })
}
}


//////////////// DELETE EVENTS /////////////////////////
 
const deleteEvent = async function(req,res){
   try{
      let id= req.params.id
      
         if(!isValidObjectId(id)){
           return res.status(400).send({status:false, msg:"EventID is invalid"})}     
       const  checkId= await eventModel.findById({_id:id})

       if(!checkId)
       return res.status(400).send({status:false,msg:" This Event does not exist"})

       if(checkId.isDeleted==true)
       return res.status(400).send({status:false,msg:" This Event is already deleted"})

    //==deleting product by productId==// 
       const deletedEvent=await eventModel.findByIdAndUpdate({_id:id,isDeleted:false},
       {isDeleted:true},{new:true})
       return res.status(200).send({status:true, msg:"successfully deleted"})
   }
    catch(err){
      return res.status(500).send({status:false,msg:err})
    }
  }

///////////// EPDATE EVENT ///////////////////

const updateEvent = async function (req, res) {
   let id = req.params.id
   const image = req.files
   let updateData = req.body
   let { uploadMainImage, uploadMobileImage, eventName,ṭitle,subTitle,eventLink ,price, showStartHour, showStartMinute, showStartZone, doorOpenHour,
      doorOpenMinute,doorOpeningZone,date,eventStartHour,eventStartMinute,eventStartZone,eventEndHour,eventEndMinute,eventEndZone,
      eventStartDate,eventEndDate} = updateData

   if (!isValidObjectId(id)) {
      return res.status(400).send({ status: false, msg: "EventID is invalid" })
   }
   const checkId = await eventModel.findById({ _id: id, isDeleted: false })

   if (!checkId)
   return res.status(400).send({ status: false, msg: "Event does not exist" })

   if (!updateData)
    return res.status(400).send({ status: false, msg: "Please provide data to update" })


   if (image && image.length > 0) {

      if(image[0]){
      if (!isValidFile(image[0].originalname)) return res.status(400).send({ status: false, message: "Please provide image only" })
      let updatebanner1 = await aws.uploadFile(image[0])
      updateData.addBannerImage = updatebanner1}

      if(image[1]){
      if (!isValidFile(image[1].originalname)) return res.status(400).send({ status: false, message: "Please provide image only" })
      let updatebanner2 = await aws.uploadFile(image[1])
      updateData.addBannerImage = updatebanner2}

   let updatedData = await eventModel.findByIdAndUpdate({_id:id},updateData,{new:true})
   return res.status(200).send({status:true,msg:updatedData})

   }
}


module.exports.updateEvent=updateEvent
module.exports.getAllEvents=getAllEvents
module.exports.createEvent= createEvent
module.exports.deleteEvent=deleteEvent