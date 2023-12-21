const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const DesSchema = mongoose.Schema({
    des_name : {
        type: String,
        required:true
    },
   content : {
        type: String,
        required:true
    }
    ,
    images : {
        type: String,
        required:true
    },
    des_id : {
        type: Number,
        required:true
    }


}

)

const destinationmodel = mongoose.model("destinations",DesSchema)

module.exports = destinationmodel