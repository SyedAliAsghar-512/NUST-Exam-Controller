import React, { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import {Link} from "react-router-dom"


const Class = ({classs}) => {

  const [color, setColor] = useState("")
  const [textColor, setTextColor] = useState("")
  const savedMode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    if(savedMode) {
       setColor("#0e1011")
       setTextColor("white")
    }
      else {
         setColor("white")
         setTextColor("black")
      }

  })


  return ( 
 <>   
<div className='card rounded col-sm-12 col-md-6 col-lg-3 my-12' style={{margin: "25px"}}>
<Link to ={`/me/results/${classs?._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className='card-body ps-3 d-flex justify-content-center'>
              <h5 className='card-title' style={{ color: "#ecf8fd"}}>
                <Link to ={`/me/results/${classs?._id}`}>{classs.subject}</Link>
              </h5>
                </div>
                <div className='color'>
                <p className='card-text mt-2' style={{ color: "black", textAlign: 'center', fontSize: "16px"}}>Teacher: {classs?.teacher}</p> 
                <p className='card-text mt-2' style={{ color: "black", textAlign: 'center', fontSize: "16px"}}>Credit Hours: {classs.credit}</p> 
                <p></p>
            </div>
            </Link>
            </div>
</>
  );
};

export default Class;