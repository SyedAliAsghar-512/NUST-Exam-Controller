import React from "react";
import SideMenu from "./SideMenu";

const UserLayout = ({children}) => {

    const menuItem = [

        {
          name: "Profile",
          url: "/me/profile",
          icon: "faUser",
        },
  
        {
          name: "Update Profile",
          url: "/me/update_profile",
          icon: "faUser",
        },
  
        {
          name: "Upload Avatar",
          url: "/me/upload_avatar",
          icon: "faUserCircle",
        },
  
        {
          name: "Update Password",
          url: "/me/update_password",
          icon: "faLock",
        },
  
      ]
  
    return(
        <>
        <div>
           <p></p>
            <h2 className="text-center fw-bolder" style={{color: "grey", marginLeft: "300px"}}>Profile</h2>
           <p></p>

           <div className="container">
            <div className="row justify-content-around">
                <div className="col-12 col-lg-3">
                    <SideMenu menuItem={menuItem}/>
                </div>
                <div className="col-12 col-lg-8 user-dashboard">{children}</div>
            </div>
           </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://kit.fontawesome.com/9edb65c86a.js"></script>

        
        </>
    )
}

export default UserLayout