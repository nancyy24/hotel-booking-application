import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "antd/dist/antd.min.css";
import "../homepage/home.css";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, Space } from "antd";
import moment from "moment";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

const { RangePicker } = DatePicker;
function Home() {
  let {place_id} = useParams();
  let [fromdate, setFromDate] = useState();
  let [toDate, setToDate] = useState();
  let [room, setRoom] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [filter, setFilter] = useState({page : 1, destination_id : place_id});
  let [duplicaterooms, setDuplicateRooms] = useState([]);
  let [searchkey, setSearchKey] = useState("");
  let [roomtype, setRoomType] = useState("All");
  let [temporaryRooms,setTemporarayRooms] = useState([]);
  let [increaseValue,setIncreaseValue] = useState(2)
  let [decreaseValue,setdecreaseValue] = useState(1);
  let [ count,setCount] = useState(0);
  let [total,setTotal] = useState(0);
  let [subLocations, setSubLocations] = useState({})
  let navigate = useNavigate();

  // let temprooms = [];


  const get_all_rooms = async () => {
    try {
      let { data } = await axios.get("http://localhost:5000/api/all_room");
      console.log(data);
      const result = data.result;
      console.log("result", result);
      setRoom(result);
      setDuplicateRooms(result);
      console.log("room", room);
    } catch (error) {
      console.log(error);
    }
  };


  const get_all_sublocations = async () => {
    try {
      let { data } = await axios.get("http://localhost:5000/api/getvisitingplacebyID/"+place_id);
      console.log(data);
      const result = data.result;
      console.log("result", result);  
      setSubLocations({...result})
    } catch (error) {
      console.log(error);
    }
  };


  const get_rooms_by_place_id = async () => {
    try {
      let { data } = await axios.get("http://localhost:5000/api/all_rooms_by_place_id/"+place_id);
      console.log(data);
      const result = data.result;
      console.log("result", result);
      setRoom(result);
      setDuplicateRooms(result);
      console.log("room", room);
    } catch (error) {
      console.log(error);
    }
  };

  let filterByDate = (dates) => {

    // console.log(dates)
    console.log(moment(dates[0]).format('DD-MM-YYYY'))
    console.log(moment(dates[1]).format('DD-MM-YYYY'))
    setFromDate(moment(dates[0]).format("DD-MM-YYYY"));
    setToDate(moment(dates[1]).format("DD-MM-YYYY"));

    let temprooms = [];
    
   

  for (const duproom of duplicaterooms) {
      var availability = false;
      let count =0;
      if (duproom.totalbookings.length>0) {
        for (const bookedroom of duproom.totalbookings) {
          if (
            !moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(
              bookedroom.fromdate,
              bookedroom.todate
            ) &&
            !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(
              bookedroom.fromdate,
              bookedroom.todate
            )
          ) {
            if (
              moment(dates[0]).format("DD-MM-YYYY") !== bookedroom.fromdate &&
              moment(dates[1]).format("DD-MM-YYYY") !== bookedroom.fromdate &&
              moment(dates[0]).format("DD-MM-YYYY") !== bookedroom.todate &&
              moment(dates[1]).format("DD-MM-YYYY") !== bookedroom.todate
            ) {
              availability = true;
              // count++;

            }

      
          }
        }

        
      }
      // if( count != duproom.totalbookings.length )
      //   {
      //     availability = false;
      //   }
      if (availability == true || duproom.totalbookings.length == 0) {
        temprooms.push(duproom);
  }
    }

    console.log("temprooms",temprooms);
    setRoom(temprooms);
    setTemporarayRooms(temprooms);
    console.log(room);
    filterOperation(filter);
  };
  function filterbySearch() {
    const newrooms_1 = temporaryRooms.filter((hotelroom) =>
      hotelroom.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    // console.log(newrooms_1);
    // setRoom(newrooms_1);

    if(newrooms_1.length  > 0 )
    {
      setRoom(newrooms_1);
    }
    else if (newrooms_1.length  ===  0 ){
    // get_all_rooms();
    setRoom([])
    // Swal.fire({
    //   icon: "error",
    //   title: "No Such text Found",
    //   text: "Search Something Different!",
    // });
    }
  
  }

  let getLocationList = async () => {
    try {
      let response = await axios.get("http://localhost:5000/api/get-location");
      let data = response.data;
      // console.log(data);
      if (data.status === true) {
        setLocationList([...data.result]);
      } else {
        setLocationList([]);
      }
    } catch (error) {
      // console.log(error);
      // alert("server error");
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong!",
      });
    }
  };
  let funsearchKey = (e) => {
    setSearchKey(e.target.value);
    console.log(searchkey);
  };

  let filterByType = (e) => {
    setRoomType(e.target.value);
    console.log(e.target.value);
    let targetvalue = e.target.value;

    if (targetvalue !== "All") {
      const newrooms_2 = duplicaterooms.filter(
        (hotelroom) =>
          hotelroom.roomtype.toLowerCase() === targetvalue.toLowerCase()
      );
      console.log(newrooms_2);
      setRoom(newrooms_2);
    } else {
      setRoom(duplicaterooms);
    }
  };

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
    } else {
      navigate("/bookroom/" + room_id + "/" + fromdate + "/" + toDate);
      // alert("login first")
      // console.log("login First")
    }
  };

  let filterOperation = async (filter) => {
    let URL = "http://localhost:5000/api/filter";

    try {
      let response = await axios.post(URL, filter);
      // console.log(response);
      let data = response.data;
      if (data.status === true) {
        let listresult = data.newresult;
        let len = data.len;
        setTotal(len);
        setCount(listresult.length);
        // const operation = (list1, list2, isUnion = false) =>
        //   list1.filter(
        //     (
        //       (set) => (a) =>
        //         isUnion === set.has(a._id)
        //     )(new Set(list2.map((b) => b._id)))
        //   );

        // // Following functions are to be used:
        // const inBoth = (list1, list2) => operation(list1, list2, true),
        //   inFirstOnly = operation,
        //   inSecondOnly = (list1, list2) => inFirstOnly(list2, list1);

        // var list1 = [...temporaryRooms];
        // var list2 = data.newresult;
        // console.log("data result",data.newresult);
        // console.log('list1',list1);
        // console.log("list2",list2);
        // var listresult = inBoth(list1,list2);
        // // filter.sort = 1;
        // console.log(filter.hasOwnProperty("sort"));     
        // console.log("filter",filter);
        if(filter.hasOwnProperty('sort'))
        {
          console.log(filter.sort);
          if(filter.sort === 1 )
          {
            listresult.sort((a, b) => {
              return a.costperday - b.costperday;
          });
          }
          else{
            listresult.sort((a, b) => {
              return b.costperday - a.costperday;
          });
          }
        }
        else{
          listresult.sort((a, b) => {
            return a.costperday - b.costperday;
        });
        }
        


        console.log("listresult",listresult);
        setRoom([...listresult]);
        // setTemporarayRooms([...listresult]);

        // setRoom([...data.result]);



        // console.log(restaurantList);


      }

    } catch (error) {
      // alert("server error");
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong!",
      });

      // console.log(error);
    }
  };

  let makeFiltration = (event, type) => {
    let value = event.target.value;
    console.log(value);
    // let ischecked= event.target.checked;
    // console.log(ischecked);
    // console.log(event);
    // console.log( value);
    

    switch (type) {
      case "location":
        if (Number(value) > 0) {
          filter["location_id"] = Number(value);
        } else {
          delete filter["location_id"];
        }
        break;
      case "page":
          filter["page"] = Number(value);
          break;
      case "roomtype":
        if (Number(value) > 0) {
          filter["roomtypeid"] = Number(value);
        } else {
          delete filter["roomtypeid"];
        }
        break;
      case "sort":
        filter["sort"] = Number(value);
        break;
      case "cost-for-two":
        let costForTwo = value.split("-");
        filter["lcost"] = Number(costForTwo[0]);
        filter["hcost"] = Number(costForTwo[1]);
        break;
   
      
    }
    setFilter(filter);
    // filterByType();
    filterOperation(filter);
  };

  console.log("location", locationList);
  useEffect(() => {
    // get_all_rooms();
    get_rooms_by_place_id();
    filterOperation(filter);
    getLocationList();
    get_all_sublocations();
  }, []);
  // console.log(room);
// console.log("filetr",filter);
console.log(subLocations)
console.log(subLocations["one"])

  return (
    <>
      <div className="container-fluid">
        <p className="headings fw-bolder fs-1 ms-5 mb-0">
          Discover The Resorts and plan the perfect holidays !!!
        </p>
        <p className="headings fw-bolder fs-2 ms-5 mb-0">
          Explore The New Adventures in  <span className="fs-1 headings fw-bolder text-danger ">{subLocations.des_name}</span>...
        </p>
        <div className="d-flex justify-content-end mb-0 fw-bolder fs-5 container">
      
        <p className=" align-center mb-0 me-5"> Showing {count}/{total} Results </p>
        <p className="mb-0 badge rounded-pill bg-danger p-2 me-5"> Page {filter.page}</p>
        </div>
        <div className="row ">
          {/* filter section */}
          <div className="col-10 col-lg-3 filter-section ms-5 me-5 fw-bolder p-4  ">
            {/* <p className="fs-4 fw-bolder mb-0">Filter Section</p> */}


         
            <p className="fs-md-3 fs-5 fw-bolder mb-2 w-md-25 w-lg-25 ">
              Book your dates...{" "}
            </p>
            <RangePicker
              format="DD-MM-YYYY"
              className="ant-picker ant-picker-range mb-3 border border-1 border-dark p-2 w-100"
              onChange={filterByDate}
            />
            {/* <div>
                <input type="text"  className="form-control" placeholder='Search your room' value={searchkey} onchange={(e)=>{ setSearchKey(e.target.value)} } onKeyUp={filterbySearch} />

            </div> */}
            {/* <p className="fs-md-3 fs-5 fw-bolder mb-2  w-md-25 w-lg-25 ">
              Search Room...
            </p> */}
            {/* <div className="form-floating  border border-1 border-dark d-flex justify-content-between p-2 mb-2 ">
              <input
                type="text"
                className="form-control w-75 p-3 "
                id="floatingInput"
                value={searchkey}
                onChange={funsearchKey}
                placeholder="Search your room"
              />
              <label htmlFor="floatingInput" class>
                Search Your Room
              </label>
              <button onClick={filterbySearch} className="searchbutton w-25">
                Search
              </button>
            </div>  */}
            <p className="m-0 text-black fs-md-3 fs-5 fw-bolder mb-2  w-md-25 w-lg-25">
              Select Location...
            </p>
            <select
              className="mt-2 form-select text-dark p-2 mb-2  border border-dark"
              onChange={(event) => {
                makeFiltration(event, "location");
              }}
            >
              <option
                value="-1"
                //   onChange={(event)=>{ makeFiltration(event,"location");
                // }}
              >
                ----select----
              </option>
              {/* {locationList.map((location, index) => {
                return (
                  <option
                    value={location.location_id}
                    key={index}
                     onChange={(event)=>{ makeFiltration(event,"location");
                     }}
                  >
                    {location.name},{location.city}
                  </option>
                );
              })} */}
            {<option value ="1"    onChange={(event)=>{ makeFiltration(event,"location");
                     }}>
{subLocations.one}

            </option>}
            {<option value ="2"   onChange={(event)=>{ makeFiltration(event,"location");
                     }} >
{subLocations.two}

            </option>}
             {<option value ="3"   onChange={(event)=>{ makeFiltration(event,"location");
                     }} >
{subLocations.three}

            </option>}
             {<option value ="4"   onChange={(event)=>{ makeFiltration(event,"location");
                     }} >
{subLocations.four}

            </option>} {<option value ="5"  onChange={(event)=>{ makeFiltration(event,"location");
                     }} >
{subLocations.five}

            </option>}

            </select>
         
            {/* select */}
            <div>
              <p className="fs-md-3 fs-5 fw-bolder mb-2   w-md-25 w-lg-25 ">
                Room Type...
              </p>
              <select
                className="form-control border border-dark text-dark "
                // value={roomtype}
                // onChange={(e) => {
                //   filterByType(e);
                // }}
                onChange={(event) => {
                  makeFiltration(event, "roomtype");
                }}
              >
                <option value="-1" className="text-dark">
                  All
                </option>
                <option value="3" className="text-dark">
                  Deluxe
                </option>
                <option value="2" className="text-dark">
                  Standard
                </option>
              </select>
            </div>
            {/* <select>Select location</select>
            <option>---Select---</option> */}

            <div>
              {/* <button>Name</button> */}
              {/* <!-- cost --> */}
              <p className="m-0 mb-2 mt-3 fw-bold fs-md-3 fs-5 fw-bolder mb-2  w-md-25 w-lg-25 ">
                Cost Per Day..
              </p>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="cost-for-two"
                  value="0-500"
                  onChange={(event) => {
                    makeFiltration(event, "cost-for-two");
                  }}
                />
                <label className="form-check-label text-black fw-bold fs-6">
                  Less than ` 500
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="cost-for-two"
                  value="500-1000"
                  onChange={(event) => {
                    makeFiltration(event, "cost-for-two");
                  }}
                />
                <label className="form-check-label text-black fw-bold fs-6">
                  ` 500 to ` 1000
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="cost-for-two"
                  value="1000-1500"
                  onChange={(event) => {
                    makeFiltration(event, "cost-for-two");
                  }}
                />
                <label className="form-check-label text-black fw-bold fs-6">
                  ` 1000 to ` 1500
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="cost-for-two"
                  value="1500-2000"
                  onChange={(event) => {
                    makeFiltration(event, "cost-for-two");
                  }}
                />
                <label className="form-check-label text-black fw-bold fs-6">
                  ` 1500 to ` 2000
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="cost-for-two"
                  value="2000-99999"
                  onChange={(event) => {
                    makeFiltration(event, "cost-for-two");
                  }}
                />
                <label className="form-check-label text-black fw-bold fs-6">
                  ` 2000+
                </label>
              </div>
              {/* <!-- sort --> */}
              <p className="m-0  mt-4 fw-bold m-0 mb-2 mt-3 fw-bold fs-md-3 fs-5 fw-bolder mb-2  w-md-25 w-lg-25 ">
                Sort...
              </p>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="sort"
                  value="1"
                  onChange={(event) => {
                    makeFiltration(event, "sort");
                  }}
                />
                <label className="form-check-label text-black fw-bold fs-6">
                  Price low to high
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="sort"
                  value="-1"
                  onChange={(event) => {
                    makeFiltration(event, "sort");
                  }}
                />
                <label className="form-check-label text-black fw-bold fs-6">
                  Price high to low
                </label>
              </div>
            </div>
          </div>
          <div className=" col-10 col-lg-7 room-section ms-lg-3 mt-lg-0 mt-5 ms-5">
          {room.length > 0 ? 
           ( room.map((roomdetails) => {
              return (
                <>
                  <div className="row room-sec d-flex mb-5 ms-2 ">
                    <img
                      src={"/"+roomdetails.image}
                      className="room-img my-3"
                    ></img>

                    <div className="descrip-box mt-3">
                      {/* name,description,maxcount,rating,image,roomtype,locality and city,facility */}
                      <p className="ms-3 fw-bold headings fs-2">
                        {roomdetails.name}
                      </p>
                      <div className="row ms-3">
                        <div className="col-5">
                          <p className="fw-bold fs-5">
                            People
                          </p>
                          <p className="fw-bold fs-5">Rating</p>
                          {/* <p className="fw-bold fs-5">Facilities</p> */}
                          <p className="fw-bold fs-5 ">Room type</p>
                          <p className="fw-bold fs-5">Cost per Day</p>
                          <p className="fw-bold fs-5">locality</p>
                        </div>
                        <div className="col-5 fs-5">
                          <p className="fs-5">{roomdetails.no_of_people}</p>
                          {/* <p>8.1</p> */}
                          <p className="badge rounded-pill bg-danger fs-6 ">
                            {roomdetails.aggregate_rating}
                          </p>
                          {/* <p>{roomdetails.facilities}</p> */}
                          <p>{roomdetails.roomtype}</p>
                          
                          <p>{roomdetails.costperday}</p>
                          <p>
                            {roomdetails.locality}, {subLocations.des_name}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex flex-end justify-content-end mb-3">
                        {fromdate && toDate ? (
                          <button
                            className="btn btn-dark me-3 p-2"
                            // onClick={() =>
                            //   navigate(
                            //     "/bookroom/" +
                            //       roomdetails._id +
                            //       "/" +
                            //       fromdate +
                            //       "/" +
                            //       toDate
                            //   )
                            // }
                            onClick={() => {
                              bookHotelRoom(roomdetails._id);
                            }}
                          >
                            BOOK NOW !!
                          </button>
                        ) : null}
                        <button
                          className="btn btn-dark p-2 me-3"
                          onClick={() =>
                            navigate("/aboutroom/" + roomdetails._id)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })): (
        
          <div className=" not-found-section pt-3" >

         <p className="  mb-0 text-error "> Hotel Rooms Not Found !!!</p>
            <div className="not-found-sub"> 
            <img src="/Images/wallpaper2.png" className="not-found-img"></img>
            </div>

            </div>
      
            )
       
          }

          <div className="row mt-4">
                <div className="col-12 justify-content-center d-flex">
                  <ul className="pagination">
                    <li className="page-item group-item"  value={decreaseValue} 
                    onClick={ (event) =>{  {  makeFiltration(event,"page");
                                                 decreaseValue <= 1  ?
                                                    ( setdecreaseValue(1) )
                                                        : 
                                                    (setdecreaseValue(decreaseValue-1))}
                                                        }} >&lt;</li>
                    <li className="page-item group-item" value="1" onClick={(event) =>{ makeFiltration(event,"page");
                                                                                        setIncreaseValue(2);
                                                                                        setdecreaseValue(0)}}>1</li>
                    <li className="page-item group-item" value="2" onClick={(event) =>{ makeFiltration(event,"page");
                                                                                        setIncreaseValue(3);
                                                                                        setdecreaseValue(1)}
                                                                                              }>2</li>
                    <li className="page-item group-item" value="3" onClick={(event) =>{ makeFiltration(event,"page");
                                                                                         setIncreaseValue(4);
                                                                                         setdecreaseValue(2)}}>3</li>
                    <li className="page-item group-item" value="4" onClick={(event) =>{ makeFiltration(event,"page");
                                                                                          setIncreaseValue(5);
                                                                                          setdecreaseValue(3)}}>4</li>
                    <li className="page-item group-item" value="5" onClick={(event) =>{ makeFiltration(event,"page")
                                                                                        }}>5</li>

<li className="page-item group-item" value="6" onClick={(event) =>{ makeFiltration(event,"page")
                                                                                        }}>6</li>
  <li className="page-item group-item" value="7" onClick={(event) =>{ makeFiltration(event,"page")
                                                                                        }}>7</li>
                                                                                          <li className="page-item group-item" value="8" onClick={(event) =>{ makeFiltration(event,"page")
                                                                                        }}>8</li>
                                                                                          <li className="page-item group-item" value="9" onClick={(event) =>{ makeFiltration(event,"page")
                                                                                        }}>9</li>
                                                                                          <li className="page-item group-item" value="10" onClick={(event) =>{ makeFiltration(event,"page")
                                                                                        }}>10</li>                                                                                      
                    <li className="page-item group-item"  value={increaseValue} 
                    onClick={ (event) =>{  {  makeFiltration(event,"page");
                                                 increaseValue >= 10  ?
                                                    ( setIncreaseValue(1) )
                                                        : 
                                                    (setIncreaseValue(increaseValue+1))}
                                                        }}>&gt;</li>
                  </ul>
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
