const mongoose = require("mongoose")


const vistingPlacesSchema = mongoose.Schema({
    des_id : {
        type: Number,
        required:true
    },
    des_name : {
        type: String,
        required:true
    },
   one: {
        type: String,
        required:true
    }
    ,
    two : {
        type: String,
        required:true
    },
    three : {
        type: String,
        required:true
    },  
    four : {
        type: String,
        required:true
    },  
    five : {
        type: String,
        required:true
    }


}

)

const vistingPlacesModel = mongoose.model("vistingplaces",vistingPlacesSchema)

module.exports = vistingPlacesModel