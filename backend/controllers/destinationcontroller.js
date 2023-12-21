const destinationModel = require("../modals/destinations")


module.exports.getDestinationList = async (request,response)=>
{   try{
    var result = await destinationModel.find()

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
