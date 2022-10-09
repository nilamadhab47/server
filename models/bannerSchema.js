const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({

    addBannerImage: {
        
        // required:true
    },

    addMobileBannerImage: {
        // required:true
    }, 

    bannerName: {
        type: String,
        required: true,
        trim:true
    }, 

    bannerLink: {
        type: String,
        required: true,
        trim:true
    }, 
    
    // // //////////////// BANNER START TIMINGS ///////////////// 
    
    
    bannerStartHour: {
        type: Number,
        required: true,
        trim:true
    },
    bannerStartMinute: {
        type: Number,
        required: true,
        trim:true
    },
    bannerStartZone: {
        type: String,
        enum:["AM","PM"],
        required: true
        },

    // // // //////////////// BANNER CLOSE TIMINGS ///////////////// 


    bannerCloseHour: {
       type: Number,
        required: true,
        trim:true
    },

    bannerCloseMinute: {
        type: Number,
        required: true,
        trim:true
    },

    bannerCloseZone: {
        type: String,
        enum:["AM","PM"],
        required: true,
        trim:true
        },
        
    // // ////////// BANNER START DATE/////////////
   
    bannerStartDate: {
        type: Date,
        required: true,
        trim:true
    },

    // //  // ////////// BANNER CLOSE DATE/////////////
   
     bannerEndDate: {
        type: Date,
        required: true,
        trim:true
    },


    isDeleted:{
        type:Boolean,
        default: false
    }

},{timestamps:true})

module.exports = mongoose.model("Candleriggs Banner Form", bannerSchema);