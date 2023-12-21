import { useEffect, useState } from "react"
import "../profilepage/profilepage.css"
import jwt_decode from "jwt-decode";
import axios from "axios"
import Swal from "sweetalert2";

function Profile(){

  let [tab,setTab] = useState(1);
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
  

    return (<>
       <div className="ms-5 overview-box mt-3  mb-5">
        <p className="fw-bold my-4 fs-1 headings">Details About You !!</p>
        <div className="border-bottom border-danger w-75  pb-3 mb-3">
                <h4 className="fw-bold fs-2 headings">Name </h4>
                
                <p className="mb-0 ms-5 fs-5">
                  {userdetails.given_name}</p>
        </div>
        <div  className="border-bottom border-danger w-75  pb-3 mb-3">
                <h4 className="fw-bold fs-2 headings">Email Id</h4>
                <p className="mb-0 ms-5 fs-5">{userdetails.email}</p>
        </div>
        <div className="border-bottom border-danger w-75  pb-3 mb-3" >
                <h4 className="fw-bold fs-2 headings ">Contact No.</h4>
                <p className="mb-0 ms-5 fs-5">{userdetails.mobile}</p>
        </div>
        <div className="border-bottom border-danger w-75  pb-3 mb-3" >
                <h4 className="fw-bold fs-2 headings">User Id</h4>
                <p className="mb-0  ms-5 fs-5">{userdetails._id}</p>
        </div>
       
      
        </div>
        
    
    
    </>)
}


export default Profile