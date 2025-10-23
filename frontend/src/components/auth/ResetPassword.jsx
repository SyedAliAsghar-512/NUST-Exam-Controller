import React, { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../layouts/MetaData";

const ResetPassword = () => {

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const {isAuthenticated} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const params = useParams()
    const [resetPassword, {isLoading, error, isSuccess}] = useResetPasswordMutation()

    const [color, setColor] = useState("")
    const [textColor, setTextColor] = useState("")
    const savedMode = localStorage.getItem('darkMode') === 'true';


    useEffect(() => {
      if(savedMode) {
         setColor("#0e1011")
         setTextColor("white")
      }
        else {
           setColor("#f5f5f5")
           setTextColor("black")
        }
  
    })

    useEffect(() => {

        if(error) {
            toast.error(error?.data?.message)
        } 
        if(isSuccess) {
          toast.success("Password Reseted Successfully")
          navigate("/")
        }
    }, [error, isAuthenticated, isSuccess])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            return toast.error("Password does not match")
        }
         
        const data = {password, confirmPassword}

        resetPassword({token: params?.token , body: data})

    }

    return (
      <>
      <MetaData title="Reset Password - Shopholic" />
      <div className="row wrapper" style={{ padding: "10px"}}>
      <div className="col-10 col-lg-5">
        <form
          style={{ backgroundColor: color}}
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">New Password</h2>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password_field" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button id="new_password_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
            {isLoading ? "Updating..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
    </>  
    ) }

    export default ResetPassword
        