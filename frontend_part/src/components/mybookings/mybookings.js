import "../mybookings/mybookings.css"
import { useEffect, useState } from "react"

import jwt_decode from "jwt-decode";
import axios from "axios"
import Swal from "sweetalert2";
function MyBookings(){

    let[bookedroomsbyId,setBookedroomsbyId] = useState([])

    let profiledetails = localStorage.getItem("current-token")
  
    if(localStorage.getItem("current-token") ){
    
      var userdetails = jwt_decode(localStorage.getItem("current-token"))
        
    }      
    let getbookingdetails = async ()=> {
        const userIdDetails = {
        id : userdetails._id
        }
        try{
            let URL = "http://localhost:5000/api/getroomsbyId";
            let response = await axios.post(URL,userIdDetails);
            const data = response.data;
            // console.log(data);
            if(data.status === true)
            {
              console.log(data)
              setBookedroomsbyId([...data.result])
              // setRestaurant({...data.result});
            //   setRoom_detail({...data.result});
            }
            else{
            //   setRoom_detail({...defaultValue});
            console.log("no such room")
            }
          }
            
          
          catch(error){
            alert("server error");
            
          }
      }
    
      let cancelBooking = async(bookingid,roomid) =>{
        let cancelroomsobj = {
            bookingid : bookingid,
            roomid : roomid
        }
            try{            
                const result = await axios.post("http://localhost:5000/api/cancelroom",cancelroomsobj)
            //     console.log(result)
            Swal.fire({
                    icon: 'success',
                    title: 'Cancel Booking',
                    text: 'Booking Cancelled!!',
                  })
                  .then(() =>
                  {
                    window.location.reload();
            
                  })
            }
            catch(error)
            {
                console.log(error)
            }
      }
      
      useEffect(()=> {getbookingdetails()},[])
return (<>



    {
        (profiledetails && bookedroomsbyId.length) > 0  ?
        (
<div className="mt-4">
{/* <h2>search</h2> */}
                { bookedroomsbyId.map((rooms,value) =>{
          return(  <div className="ms-5 contact-box  headings container-fluid mb-5">
        <p className="fw-bold mb-4  fs-1 headings">Booking details</p>
        <div className="border-bottom border-danger w-75  pb-3 mb-2 row ">
                <h4 className=" col-4 fw-bold fs-2 headings">Hotel Name</h4>
                <p className=" col-7 text-danger mb-0  ms-5 fs-5">{rooms.room}</p>
        </div>
        <div className="border-bottom border-danger w-75  pb-3 mb-2 row">
                <h4 className=" col-4 fw-bold fs-2 headings">Booking Id</h4>
                <p className=" col-7 mb-0  ms-5 fs-5">{rooms._id}</p>
        </div>
        <div className="border-bottom border-danger w-75  pb-3 mb-2 row">
                <h4 className=" col-4 fw-bold fs-2 headings">Check-In</h4>
                <p className=" col-7 mb-0  ms-5 fs-5">{rooms.fromdate}</p>
        </div>
        <div className="border-bottom border-danger w-75  pb-3 mb-2  row ">
                <h4 className=" col-4 fw-bold fs-2 headings">Check-Out</h4>
                <p className=" col-7 mb-0  ms-5 fs-5">{rooms.todate}</p>
        </div>
        
        <div className="border-bottom border-danger w-75  pb-3 mb-2  row ">
                <h4 className=" col-4 fw-bold fs-2 headings">Total Days</h4>
                <p className="col-7 mb-0  ms-5 fs-5">{rooms.totaldays}</p>
        </div>
        <div className="border-bottom border-danger w-75  pb-3 mb-2 row ">
                <h4 className=" col-4 fw-bold fs-2 headings">Status</h4>
                <p className=" col-7 mb-0  ms-5 fs-5">{ rooms.status === "booked" ? (<span class="badge bg-success rounded-pill">Booked</span>) : (<span class="badge bg-danger rounded-pill">Cancelled</span>)}</p>
        </div>
        <div className="border-bottom border-danger w-75  pb-3 mb-2 row">
                <h4 className=" col-4 fw-bold fs-2 headings">Total Amount</h4>
                <p className=" col-7 mb-0  ms-5 fs-5">{rooms.totalamount}</p>
        </div>
        { rooms.status !== "Cancelled" ? ( <div className="d-flex justify-content-end mt-3 p-3">
            <button className="btn btn-dark btn-lg" onClick={() =>{ cancelBooking(rooms._id,rooms.roomid)  }}>Cancel Booking</button>
        </div>) : ( <div className="d-flex justify-content-end mt-3 p-3">
            <button className="btn btn-danger btn-lg" >This Booking Room has been Cancelled</button>
        </div>)}
       
        </div>)
        }) 
                }
</div>
        ) : 
        (<div className="text-center">
        <p className="text-error mb-0"> Oops !! No Bookings Yet !!!</p>
                <div className="p-5 pt-0 oops-box">
            <img src="Images/no-found-img.jpg" className="not-image-found "></img>
        </div>
        </div>
        ) 
        
    }
</>)
}
    export default MyBookings