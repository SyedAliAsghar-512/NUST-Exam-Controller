import React from "react";
import UserLayout from "../layouts/UserLayout";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MetaData"
import { Link } from "react-router-dom";

const Profile = () => {

    const {user} = useSelector((state) => state.auth)

    return (
      <>
            <MetaData title="Profile -  Qalam" />
        <UserLayout>
        <div class="card p-6 rounded" style={{ padding: "10px", }}>
            <div className="row justify-content-around mt-5 user-info">
      <div className="col-12 col-md-3">
        <figure className="avatar avatar-profile">
          <img
            className="rounded-circle img-fluid"
            src={user?.avatar ? user?.avatar?.url : "https://github.com/ghulamabbas2/shopitv2-html/blob/master/images/default_avatar.jpg?raw=true"}
            alt={user?.name}
          />
        </figure>
      </div>

      <div className="col-12 col-md-5">
        <h4>Name</h4>
        <p>{user?.name}</p>

        <h4>Degree</h4>
        <p>{user?.degree}</p>

        <h4>Program</h4>
        <p>{user?.program}</p>

        <h4>Current Semester</h4>
        <p>{user?.semester}</p>

        <p></p>

        <Link to="/me/contact_info" className="btn" style={{ backgroundColor: "#fa9c23", fontWeight: "bold", margin: "20px"}}>Contact Info</Link>
        <Link to="/me/bio_data" className="btn" style={{ backgroundColor: "#fa9c23", fontWeight: "bold"}}>Bio Data</Link>

      </div>
    </div>
    </div>
        </UserLayout>

        </>
    )

}

export default Profile