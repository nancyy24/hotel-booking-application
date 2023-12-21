import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import "../quickSearch/quickSearch.css"


function QuickSearch(){

    let [mealTypeList,setMealTypeList] = useState([]);
    
    let getMealTypes = async() =>{
    try{
    let  response = await axios.get("http://localhost:5000/api/get-destinations");
    // console.log(response);
    // console.log(response.data);
    let data= response.data;
    if(data.status === true)
    {
        setMealTypeList([...data.result]);
        // console.log(...data.result);
        // console.log("result",data.result);
    }
    else{
        setMealTypeList([]);
    }
    }
    catch(error){
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Something went wrong!',

          })
    }}
    let navigate = useNavigate();
    let getQuickSearchPage = (id) => {
        
        navigate("/homepage/"+id);
    }
    useEffect(()=>{
        getMealTypes();
    },[]);


    
    // console.log("answer",...data.result);
    // console.log(mealTypeList);


    
    return <>
        
           
                <div className="container">
                    <p className="m-0 h3 mt-4 mt-sm-5 fw-bold fs-3">Find your next stay</p>
                    <p className="m-0 small text-muted mt-1 mb-3 fs-4"> Search low prices on hotels, homes and much more...</p>
                    {/* <!-- first row --> */}
                    <div className="row justify-content-between ">
                        { mealTypeList.map((mealType,index) => {
                        return (<div key={index}   onClick = { () => getQuickSearchPage(mealType.des_id)} className=" col-4 cursor-pointer  border border-1 ps-0  setwidth set-border mb-3 room-sec  ">
                            <img src={mealType.images} className="section-img ps-3 pt-3 " />
                            
                                <p className="m-0 h4 fw-bold text-center">{mealType.des_name}</p>
               
                        </div>);

                        })
                        }
                        
                    </div>
             
            </div>
   
    </>
}

export default QuickSearch;

