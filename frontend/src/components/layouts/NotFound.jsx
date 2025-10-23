import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {

    return (
      <>
      <div class="content">
        <p></p>
          <h1 style={{textAlign: "center", color: "grey"}}>404 - Page Not Found</h1>
          <img className="err" src="/images/error.gif" alt=""/>
          <div class="text">
              <h2>Looks like you're lost</h2>
              <p>the page you are looking for not available</p>
              <Link to="/dashboard" className="btn btn-success">Go To Home</Link>
          </div>
      </div>
</>
  
    )
}

export default NotFound