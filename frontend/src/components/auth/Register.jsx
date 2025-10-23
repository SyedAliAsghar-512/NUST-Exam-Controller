import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRegisterMutation,  } from "../../redux/api/authApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MetaData";

const Register = () => {

    const [ register, { isLoading, error, data, isSuccess } ] = useRegisterMutation()
    const [showPassword, setshowPassword] = useState(true);

    const {isAuthenticated} = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    })

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

    const {name, email, password} = user

    useEffect(() => {

      if (isAuthenticated) {
        navigate("/")
      }

      if(error) {
          toast.error(error?.data?.message)
      } 

      if(isSuccess) {
        toast.success("Registered. Please login")
        navigate("/login")
      }
  }, [error, isAuthenticated, isSuccess])

    const submitHandler = (e) => {
        e.preventDefault()

        const signUpData = {
            name,
            email,
            password,
        }

        register(signUpData)

    }

    const onChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value })
    }

    return(
      <>
      <MetaData title="Register - Shopholic" />
        <div class="row wrapper" style={{ padding: "10px"}}>
        <div class="col-10 col-lg-5">
          <form
            style={{ backgroundColor: color}}
            onSubmit={submitHandler}
          >
            <h2 class="mb-4">Register</h2>
  
            <div class="mb-3">
              <label htmlFor="name_field" class="form-label">Name</label>
              <input
                type="text"
                id="name_field"
                class="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>
  
            <div class="mb-3">
              <label htmlFor="email_field" class="form-label">Email</label>
              <input
                type="email"
                id="email_field"
                class="form-control"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>
  
            <div class="mb-3">
              <label htmlFor="password_field" class="form-label">Password</label>
              <input
                type={
                  showPassword
                      ? "text"
                      : "password"
              }
                id="password_field"
                class="form-control"
                name="password"
                value={password}
                onChange={onChange}
                onClick={() =>
                  setshowPassword(
               (prevState) =>
                   !prevState
                      )
                    }
              />
            <p>Note: Click in the password area to reveal or hide password</p>
            </div>
  
            <button id="register_button" type="submit" class="btn w-100 py-2" disabled={isLoading}>
              {isLoading ? "Creating..." : "Register"}
            </button>
          </form>
        </div>
      </div>
   </>
    )
}

export default Register