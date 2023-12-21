
import { useEffect, useState } from "react"
import "../roomdetails/aboutroom.css"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel} from "react-responsive-carousel";
import { DatePicker, Space } from "antd";
import moment from "moment";
import Swal from "sweetalert2";




function AboutRoom(){

  let [tab,setTab] = useState(1);
const { RangePicker } = DatePicker;
let [fromDate, setFromDate] = useState();
let [toDate, setToDate] = useState();
console.log("from",fromDate);
console.log("to",toDate)
  let defaultValue ={
    name:"",
    no_of_people:-1,
    contact:0,
    images:[],
    totalbookings:[],
    roomtype:"",
    description:"",
    city:"",
    location:-1,
    city_id:-1,
    locality:"",
    aggregate_rating:-1,
    rating_text:"",
    image:"",
    facilities:""
  }
  let [room_detail,setRoom_detail] = useState({...defaultValue})
  let navigate = useNavigate();
  let {id} = useParams();

 
  let getRoomDetails = async()=>{
    try{
    let URL = "http://localhost:5000/api/get-room-details-by-id/"+id;
    let response = await axios.get(URL);
    const data = response.data;
    // console.log(data);
    if(data.status === true)
    {
      console.log(data)
      // setRestaurant({...data.result});
      setRoom_detail({...data.result});
    }
    else{
      setRoom_detail({...defaultValue});
    }
  }
    
  
  catch(error){
    alert("server error");
    
  }
  // console.log(data)


  }

  let bookHotelRoom = (room_id) => {
    let currentuserdetails = localStorage.getItem("current-token");
    // console.log(currentuserdetails)
    if (!currentuserdetails) {
      // console.log("login First")
      // alert("login first")
      Swal.fire({
        icon: "error",
        title: "Login First!!",
        text: "Create An Account",
      });
    } 
    else if( fromDate === undefined || toDate === undefined)
    {
      Swal.fire({
        icon: "error",
        title: "Enter Details!!",
        text: "Enter Booking Details First",
      });
    }
    else {
      navigate("/bookroom/" + room_id + "/" + fromDate + "/" + toDate);
      // alert("login first")
      // console.log("login First")
    }
  };
  let filterByDate = (dates) => {

    // console.log(dates)
    console.log(moment(dates[0]).format('DD-MM-YYYY'))
    console.log(moment(dates[1]).format('DD-MM-YYYY'))
    setFromDate(moment(dates[0]).format("DD-MM-YYYY"));
    setToDate(moment(dates[1]).format("DD-MM-YYYY"));


    
   

 

  };

     
  useEffect(()=>{
    getRoomDetails()

  },[])
  // console.log(data)
  room_detail.images.map((value,index)=>{
    console.log(value)
  })

 return (
    <>
    {/* carousel */}
    <div className="modal fade" id ="slideShow" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-lg " style={{ height :"75vh"}}>
    <div className="modal-content carousel-width ">
      <div className="modal-body h-75 ">
      <h1 className="fw-bold text-center">{room_detail.name}</h1>
      <Carousel showThumbs={false} infiniteLoop={true}>
      {
      
        room_detail.images.map((value,index) => {
          return (<div key={index} className="w-100 ">
                <img src={"/"+value} className="carousel-img"/>
          </div>);
        })
      }

      </Carousel>

      </div>
      </div>
    </div>

    </div>
        <div className="container-fluid ">
        <p className="headings fs-1 mb-0 fw-bold my-3 text-center">{room_detail.name}</p>
        <div className="row d-flex justify-content-between mt-3">
        <img src={"/"+room_detail.image} alt="" className="hotel-img gallery-img px-0"/>
        <button className="btn btn-outline-white fw-bold col-4 col-sm-7 col-md-6 col-lg-4  gallerybutton" data-bs-toggle="modal" data-bs-target="#slideShow">
          Click to see Image Gallery
        </button>
        </div>
       <div className="ms-5 fs-4  text-dark des-box  ">
        <p className="text-dark fw-bolder  mb-0">Description</p>
        <p className="headings fs-2 fw-bolder">{room_detail.description}</p>
        
       </div>

       <div className="border border-dark subbackground ">
       <div className=" tabsection  border border-dark d-flex justify-content-between container mb-3 bg-danger mt-2 ">
       
    
     
            <div className="tabstyle ms-5 border border-dark">
              <button className="me-3  cursor-pointer fs-5 " onClick={()=>{setTab(1)}}><i class="fa fa-address-book-o  ms-2 me-1" aria-hidden="true"></i>
                Overview
              </button>
              <button className=" cursor-pointer fs-5 " onClick={()=>{setTab(2)}}><i className="fa fa-phone ms-2 me-1" aria-hidden="true"></i>Contact</button>
            </div>
            <div className="d-flex border border-dark justify-content-around align-items-center w-25 me-5 ">
            <div>
            <RangePicker
              format="DD-MM-YYYY"
              className="ant-picker ant-picker-range border border-1 border-dark p-2 w-100  "
              onChange={filterByDate}
            />
   </div>
          <button
                            className="btn btn-dark  p-1 w-50"
                            onClick={() => {
                              bookHotelRoom(room_detail._id);
                            }}
                          >
                            BOOK NOW !!
                          </button>
   
            </div>
           
          </div>
       {  (tab === 1) ?        
       ( <div className="d-flex justify-content-center  ">
        <div className="ms-3 overview-box mb-5">
        <p className="fw-bold my-4 fs-1 headings">More Details of This Place...</p>
        <div className="border-bottom border-danger w-100 pb-3 mb-3">
                <h4 className="fw-bold fs-2 headings">Cost Per Day</h4>
                
                <p className="mb-0 ms-5 fs-5">
                  {room_detail.costperday}   </p>
        </div>
        <div  className="border-bottom border-danger w-100  pb-3 mb-3">
                <h4 className="fw-bold fs-2 headings">Room Type</h4>
                <p className="mb-0 ms-5 fs-5">{room_detail.roomtype}</p>
        </div>
        <div  className="border-bottom border-danger w-100  pb-3 mb-3">
                <h4 className="fw-bold fs-2 headings">Facilities</h4>
                <p className="mb-0 ms-5 fs-5">{room_detail.facilities}</p>
        </div>
        <div className="border-bottom border-danger w-100  pb-3 mb-3" >
                <h4 className="fw-bold fs-2 headings ">location</h4>
                <p className="mb-0 ms-5 fs-5">{room_detail.locality},{room_detail.city}</p>
        </div>
        <div className="border-bottom border-danger w-100  pb-3 mb-3" >
                <h4 className="fw-bold fs-2 headings">Rating</h4>
                <p className="mb-0  ms-5 fs-5">{room_detail.aggregate_rating}</p>
        </div>
        <div className="border-bottom border-danger w-100  pb-3 mb-3" >
                <h4 className="fw-bold fs-2 headings ">Reviews</h4>
                <p className="mb-0 ms-5 fs-5">{room_detail.rating_text}</p>
        </div>
        <div className="border-bottom border-danger w-100  pb-3 mb-3">
                <h4 className="fw-bold fs-2 headings">Accomodation of people per room</h4>
                <p className="mb-0 ms-5 fs-5">{room_detail.no_of_people}</p>
        </div>
        </div> 
        </div>)
        :
        (<div className="d-flex justify-content-center ">
          <div className="ms-5 contact-box  headings mb-5">
        <p className="fw-bold mb-4  fs-1 headings">Contact Details ...</p>
        <div className="border-bottom border-danger w-100  pb-3 mb-2">
                <h4 className="fw-bold fs-2 headings">Phone Number</h4>
                <p className="text-danger mb-0  ms-5 fs-5">{room_detail.contact}</p>
        </div>
        <div className="border-bottom border-danger w-100  pb-3 mb-2">
                <h4 className="fw-bold fs-2 headings">locality</h4>
                <p className="mb-0  ms-5 fs-5">{room_detail.locality},{room_detail.city}</p>
        </div>
        </div>
        </div>)
       }


</div>

        
        </div>
    </>
 )
}

export default AboutRoom
