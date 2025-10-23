import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom"
import { useMyAttendanceQuery } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';
 
const AttendSub = () => {

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

  const params = useParams()

  const {data, isLoading, error, isError} = useMyAttendanceQuery(params?.id)

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message)
    }
  }, [isError])

  const attendance = (data?.Attendance)
  const daily = (attendance?.dailyattendance)
  const date = attendance?.date

  return ( 
 <>   
<p></p>
        <h4 style={{color: "grey", padding: "5px"}}>{attendance?.subject} Attendance<hr></hr></h4>
        <h6><b>Teacher</b>: {attendance?.teacher}</h6>
        <b>Credit hour</b>: {attendance?.credit}
        <hr></hr>
        {daily?.map((value) => (
      <p>{value ? "True" : "False"}</p>
    ))} 
        {date?.map((value) => (
      <p>{value}</p>
    ))} 

</>
  );
};

export default AttendSub;