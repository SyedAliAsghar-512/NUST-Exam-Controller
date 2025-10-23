import React, {useEffect, useState} from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "../layouts/MetaData"

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setshowPassword] = useState(true);

    const navigate = useNavigate()

    const [login, {isLoading, error, data}] = useLoginMutation()
    const {isAuthenticated, user} = useSelector((state) => state.auth)

    const [color, setColor] = useState("")
    const [textColor, setTextColor] = useState("")
    const savedMode = localStorage.getItem('darkMode') === 'true';
  
    useEffect(() => {
      if(savedMode) {
         setColor("grey")
         setTextColor("white")
      }
        else {
           setColor("grey")
           setTextColor("black")
        }
      
    })


    useEffect(() => {
      if (isAuthenticated && user?.role=="user"){
        navigate("/dashboard")
        setTimeout(() => {
        navigate(0)
        }, 1000)
        }

        if (isAuthenticated && user?.role=="admin"){
          navigate("/admin/dashboard")
          setTimeout(() => {
          navigate(0)
          }, 1000)
          }

        if(error) {
            toast.error(error?.data?.message)
            
        } 
    }, [error, isAuthenticated])

    const submitHandler = (e) => {
        e.preventDefault()

        const loginData = {
            email,
            password,
        }

        login(loginData)

    }
 
    return (
        <>
        <MetaData title="Login - EC" />
        <div className="container" style={{ padding: "25px"}}>
        <div className=" row wrapper">

      <div className="card rounded col-10 col-lg-5">
        <form
          style={{ backgroundColor: "white"}}
          onSubmit={submitHandler}
        >
          <h1>Login</h1>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Login ID</label>
            <input
              type="text"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            
          />
       
          </div>


          <button id="login_button" type="submit" className="login_btn w-100 py-2" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Login"}
          </button>

        </form>
      </div>
    </div>
    </div>

    </>
    )
}

export default Login