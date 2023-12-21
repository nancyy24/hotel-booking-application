const express = require("express")

const roomModal = require("../modals/room.js")

module.exports.get_all_room = async (request,response) =>{
try{
    let result = await roomModal.find({})
    response.status(200).send({
        status:true,
        result
    });
}
catch(error){
    response.status(500).send({status:false,
        error,
    message:"server error,contact to admin"});
}
}


module.exports.getRoomDetailsById = async (request,response)=>{
    try{
    let room_id =request.params.id;
    let result = await roomModal.findOne({_id:room_id})
    if(result){
    response.status(200).send({
        status:true,
        result
    });
    }
    else{
        response.status(200).send({
            status:false,
            message:"no such restaurant"
        })
    }
}
    catch(error){
            response.status(500).send({status:false,
            error,
        message:"server error,contact to admin"});
};
};


module.exports.getAllRoomsByPlaceId = async (request,response)=>{
    try{
    let des_id =request.params.place_id;
    let result = await roomModal.find({destination_id:des_id})
    if(result){
    response.status(200).send({
        status:true,
        result
    });
    }
    else{
        response.status(200).send({
            status:false,
            message:"no such restaurant"
        })
    }
}
    catch(error){
            response.status(500).send({status:false,
            error,
        message:"server error,contact to admin"});
};
};

module.exports.addroomhotel = async(request,response)=>{

    try{
        const newroom = new roomModal(request.body)
        await newroom.save()
        response.send({
            status:true,
            message:"Room Added Succussfully"
        })
        
    }
    catch(error)
    { response.status(500).send({status:false,
        error,
    message:"server error,contact to admin"});

    }
}


module.exports.filterData = async (request,response)=>
{   let { destination_id, hcost, lcost,sort,roomtypeid,location_id,page} = request.body
    // let filter={
    //     location_id:1
    // }

    // sort +1 the low to high
    // sort -1 then high to low
    if(sort == undefined){
        sort =1
    }

    if(page === undefined ){
        page=1;
    }
    let perpage = 2;
    let startindex = (page-1)*perpage;
    let endindex = page*perpage;

    let filter={}
   
    if(hcost !== undefined && lcost !== undefined){
        hcost = hcost.toString();
        lcost = lcost.toString();
        filter["costperday"]={ $gte :lcost, $lte:hcost } 
}


if(destination_id !== undefined){
    filter["destination_id"] = destination_id
}
if(roomtypeid !== undefined) {
    filter["roomtypeid"] = roomtypeid
}

if(location_id !== undefined) {
    filter["location_id"] = location_id
}
let result = await roomModal.find(filter).sort({
    costperday:sort
})

newresult = result.slice(startindex,endindex);
let len = result.length;
response.status(200).send({

    status:true,
    newresult,
   len
})


}