const bannerModel = require("../models/bannerSchema")
const aws = require("../middleware/aws");
const { update } = require("../models/eventSchema");
const { default: mongoose } = require("mongoose");


/////////////////////////////////////////////////////////
//  VALIDATORS  //

const isValidFile = function (files) {
   let imageRegex = /.*\.(jpeg|jpg|png)$/;
   return imageRegex.test(files)
}

let isValidObjectId = function (ObjectId) {
   return mongoose.Types.ObjectId.isValid(ObjectId)
}
let isValid = function (value) {
   if (typeof value === 'undefined' || value === null) return false;
   if (typeof value === 'string' && value.trim().length === 0) return false;
   return true;
}

///////////////////////////////////////////////////////////////

const createBanner = async function (req, res) {
   try {
      let data = req.body
      
      if (Object.keys(data).length == 0) {
         return res.status(400).send({ status: false, msg: "Please enter data in form" })
      }


      let files = req.files;
      console.log(files)
      if (files.length == 0) return res.status(400).send({ status: false, message: "Please provide image" })
      if (!isValidFile(files[0].originalname)) return res.status(400).send({ status: false, message: "Please provide image only" })
      if (!isValidFile(files[1].originalname)) return res.status(400).send({ status: false, message: "Please provide image only" })


      // if(!data.addBannerImage){
      //    return res.status(400).send({ status: false,msg:"Upload banner image "})
      // }
      // if(!data.addMobileBannerImage ){
      //    return res.status(400).send({ status: false,msg:"Enter mobile banner image"})
      // }

      if (!data.bannerName || typeof (data.bannerName) != "string") {
         return res.status(400).send({ status: false, msg: "Please enter banner name" })
      }

      if (!data.bannerLink || typeof (data.bannerLink) != "string") {
         return res.status(400).send({ status: false, msg: "Event link should be valid and required" })
      }
      let reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
      if (!(reg.test(data.bannerLink))) {
         return res.status(400).send({ status: false, msg: "Enter a valid banner link" })
      }


      if (!data.bannerStartHour) {
         return res.status(400).send({ status: false, msg: "Banner start hour is required in number" })
      }

      if (!data.bannerStartMinute) {
         return res.status(400).send({ status: false, msg: "Banner start minute is required in number" })
      }

      if (!data.bannerStartZone || typeof (data.bannerStartZone) != "string") {
         return res.status(400).send({ status: false, msg: "banner start zone is required in string [AM or PM]" })
      }

      if (!data.bannerCloseHour) {
         return res.status(400).send({ status: false, msg: "banner close hour is required in number" })
      }

      if (!data.bannerCloseMinute) {
         return res.status(400).send({ status: false, msg: "Banner close minute is required in minute" })
      }

      if (!data.bannerCloseZone || typeof (data.bannerCloseZone) != "string") {
         return res.status(400).send({ status: false, msg: "Event start zone is required in string [AM or PM]" })
      }

      if (!data.bannerStartDate) {
         return res.status(400).send({ status: false, msg: "Banner start date is required in format-[yyyy-mm-dd]" })
      }

      if (!data.bannerEndDate) {
         return res.status(400).send({ status: false, msg: "Banner end date is required in format-[yyyy-mm-dd]" })
      }


      ////////////////  uploading images on aws /////////////////////


      const uploadedFileURL = await aws.uploadFile(files[0]);
      data.addBannerImage = uploadedFileURL;
      // let image2 =[]
      // const uploadedFileURL2 = await aws.uploadFile(files[1]);
      // data.addMobileBannerImage = uploadedFileURL2;
      const uploadedFileURL1 = await aws.uploadFile(files[1])
      //   image2=uploadedFileURL1
      data.addMobileBannerImage= uploadedFileURL1;


      let createdData = await bannerModel.create(data)
      return res.status(200).send({ status: true, msg: "Banner created succesfully", bannerData: createdData })
   }

   catch (error) {
      return res.status(500).send({ status: false, msg: error.message })
   }
}


// /////////////////////GET BANNER API //////////////////////////

const getAllBanners = async function (req, res) {
   try {
      let getBanner = await bannerModel.find({ isDeleted: false }).select({ addBannerImage : 1,bannerName: 1, bannerStartDate: 1, bannerEndDate: 1, _id: 1 })
      if (getBanner.length < 1) {
         return res.status(400).send({ status: false, msg: "No Events found" })
      }
      return res.status(200).send({ status: true, bannerData: getBanner })
   }
   catch (error) {
      return res.status(500).send({ status: false, msg: error.message })
   }
}


//////////// DELETE BANNER  API ////////////////

const deleteBanner = async function (req, res) {
   try {
      let id = req.params.id

      if (!isValidObjectId(id)) {
         return res.status(400).send({ status: false, msg: "BannerID is invalid" })
      }
      const checkId = await bannerModel.findById({ _id: id })

      if (!checkId)
         return res.status(400).send({ status: false, msg: " This Banner does not exist" })

      if (checkId.isDeleted == true)
         return res.status(400).send({ status: false, msg: " This Banner is already deleted" })

      //==deleting product by productId==// 
      const deletedProduct = await bannerModel.findByIdAndUpdate({ _id: id, isDeleted: false },
         { isDeleted: true }, { new: true })
      return res.status(200).send({ status: true, msg: "successfully deleted" })
   }
   catch (err) {
      return res.status(500).send({ status: false, msg: err })
   }
}

//////////////////// UPDATE BANNER API //////////////////////////
const updateBanner = async function (req, res) {
   let id = req.params.id
   const image = req.files
   let updateData = req.body
   let { addBannerImage, addMobileBannerImage, bannerName, bannerLink, bannerStartHour, bannerStartMinute, bannerStartZone, bannerCloseHour,
      bannerCloseMinute,bannerCloseZone,bannerStartDate,bannerEndDate} = updateData

   if (!isValidObjectId(id)) {
      return res.status(400).send({ status: false, msg: "BannerID is invalid" })
   }
   const checkId = await bannerModel.findById({ _id: id, isDeleted: false })

   if (!checkId)
   return res.status(400).send({ status: false, msg: "Banner does not exist" })

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

      
   let updatedData = await bannerModel.findByIdAndUpdate({_id:id},updateData,{new:true})
   return res.status(200).send({status:true,msg:updatedData})

   }
}


module.exports.updateBanner=updateBanner
module.exports.getAllBanners = getAllBanners
module.exports.createBanner = createBanner
module.exports.deleteBanner = deleteBanner