const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    isDeleted:{
        type:Boolean,
    },
    
    uploadMainImage: {
        // type:String,
        // required:true,
        // trim:true
    },
    uploadMobileImage: {
        // type:String,
        // required:true,
        // trim:true
    },
    eventName: {
        type: String,
        // required: true,
        trim:true
    },
    title: {
        type: String,
        // required: true,
        trim:true
    },
    subTitle: {
        type: String,
        // required: true,
        trim:true
    },
    eventLink: {
        type: String,
        // required: true,
        trim:true
    },
    price: {
        type: Number,
        // required: true,
        trim:true
    },
//   ////////////////// SHOW START TIMINGS ///////////////////////

    showStartHour: {
        type: Number,
        // required: true,
        trim:true
    },

    showStartMinute: {
        type: Number,
        // required: true,
        trim:true
    },

    showStartZone: {
        type: String,
        // enum:["AM","PM"],
        // required: true,
        trim:true
        },


    // /////////// DOOR OPEN TIMINGS /////////////////////

    doorOpenHour: {
        type: Number,
        // required: true,
        trim:true
    },

    doorOpenMinute: {
        type: Number,
        // required: true,
        trim:true
    },

    doorOpeningZone: {
        type: String,
        // enum:["AM","PM"],
        // required: true,
        trim:true
        },

        //////////DATE////////

    date: {
        type: Date,
        // required: true,
        trim:true
    },

    ///////////////// EVENT START TIMINGS //////////////////

    eventStartHour: {
        type: Number,
        // required: true,
        trim:true
    },

    eventStartMinute: {
        type: Number,
        // required: true,
        trim:true
    },

    eventStartZone: {
        type: String,
        // enum:["AM","PM"],
        // required: true,
        trim:true
        },

        /////////////// EVENT END TIMINGS ////////////////

    eventEndHour: {
        type: Number,
        // required: true,
        trim:true
    },

    eventEndMinute: {
        type: Number,
        // required: true,
        trim:true
    },

    eventEndZone: {
        type: String,
        // enum:["AM","PM"],
        // required: true,
        trim:true
        },



    ////////////////////
    eventStartDate: {
        type: Date,
        // required: true,
        trim:true
    },
    
    eventEndDate: {
        type: Date,
        // required: true,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default: false
    }
}
,{timestamps:true})

module.exports = mongoose.model("Candleriggs Event Form", eventSchema);