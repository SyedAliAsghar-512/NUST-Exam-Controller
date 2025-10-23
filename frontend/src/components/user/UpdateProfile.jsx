import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { useUpdateProfileMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import UserLayout from "../layouts/UserLayout";
import MetaData from "../layouts/MetaData"


const UpdateProfile = () => {

    const [gmail, setEmail] = useState("")
    const [phoneno, setphoneno] = useState("")
    const [address, setaddress] = useState("")

    const navigate = useNavigate()

    const [ updateProfile, {isLoading, error, isSuccess} ] = useUpdateProfileMutation()

    const {user} = useSelector((state) => state.auth)

    useEffect(() => {
        if (user) {
            setEmail(user?.gmail)
            setphoneno(user?.phoneno)
            setaddress(user?.address)
        }

        if(error) {
            toast.error(error?.data?.message)
        }

        if(isSuccess) {
            toast.success("Profile Updated")
            navigate("/me/profile")
        }

    }, [user, error, isSuccess])

    const submitHandler = (e) => {
        e.preventDefault()

        const userData = {
            gmail,
            phoneno,
            address
        }

        updateProfile(userData)

    }

    const [color, setColor] = useState("")
    const [textColor, setTextColor] = useState("")
    const savedMode = localStorage.getItem('darkMode') === 'true';
  
    useEffect(() => {
      if(savedMode) {
         setColor("#0e1011")
         setTextColor("white")
      }
        else {
           setColor("#f8f8f8")
           setTextColor("black")
        }
  
    })

    return (
        <>
         <MetaData title="Update Profile -  Shopholic" />
        <UserLayout>
        <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form
            style={{ backgroundColor: color}}
            onSubmit={submitHandler}
          >
            <h2 className="mb-4" style={{ color: textColor}}>Update Profile</h2>
  
            <div className="mb-3">
              <label htmlFor="name_field" className="form-label"> E-mail </label>
              <input
                type="email"
                id="name_field"
                className="form-control"
                name="email"
                value={gmail}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
  
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label"> Phone NO </label>
              <input
                type="text"
                id="email_field"
                className="form-control"
                name="phoneno"
                value={phoneno}
                onChange={(e) => setphoneno(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label"> Phone NO </label>
              <input
                type="text"
                id="email_field"
                className="form-control"
                name="address"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
              />
            </div>
  
            <button type="submit" className="btn update-btn w-100" disabled={isLoading}>{isLoading ? "Updating..." : "Update"}</button>
          </form>
        </div>
      </div>
      </UserLayout>
      </>
    )
}

export default UpdateProfile