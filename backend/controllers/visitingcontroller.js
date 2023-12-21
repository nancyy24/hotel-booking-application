const vistingPlacesModelModel = require("../modals/visitingplaces")


module.exports.getvisitingplacesList = async (request,response)=>
{   try{

    let visiting_place_id =request.params.place_id;

    var result = await vistingPlacesModelModel.findOne({des_id : visiting_place_id})

    response.status(200).send({
        status:true,
        result
    });
        }
catch(error){
    response.status(500).send({
        status:false,
        error});
}
};
