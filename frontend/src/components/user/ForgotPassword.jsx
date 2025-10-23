import React, { useEffect, useState } from "react";
import { useForgetPasswordMutation } from "../../redux/api/userApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import MetaData from "../layouts/MetaData"

const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const [forgotPassword, {isLoading, error, isSuccess}] = useForgetPasswordMutation()
    const {isAuthenticated} = useSelector((state) => state.auth)
    const navigate = useNavigate()

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
            toast.success("Email Sent. Check your inbox.")
        }

    }, [error, isAuthenticated, isSuccess])

    const submitHandler = (e) => {
        e.preventDefault()

        forgotPassword({email})

    }

    return (
      <>
            <MetaData title="Forgot Password -  Shopholic" />
        <div className="row wrapper" style={{ padding: "10px"}}>
        <div className="col-10 col-lg-5">
          <form
            style={{ backgroundColor: color}}
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Forgot Password</h2>
            <div className="mt-3">
              <label htmlFor="email_field" className="form-label">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
  
            <button
              id="forgot_password_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Email"}
            </button>
          </form>
        </div>
      </div>
    </>
    )
}

export default ForgotPassword