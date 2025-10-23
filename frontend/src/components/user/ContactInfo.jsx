import React from "react";
import UserLayout from "../layouts/UserLayout";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MetaData"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faContactCard, faEnvelope, faHome, faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactInfo = () => {

    const {user} = useSelector((state) => state.auth)

    return (
      <>
            <MetaData title="Profile -  Qalam" />
        <UserLayout>
        <div class="card p-6 rounded" style={{ padding: "10px", }}>
            <div className="row justify-content-around mt-5 user-info">
      <div className="col-12 col-md-7">
        <figure className="avatar avatar-profile">
          <img
            className="rounded-circle img-fluid"
            src={user?.avatar ? user?.avatar?.url : "https://github.com/ghulamabbas2/shopitv2-html/blob/master/images/default_avatar.jpg?raw=true"}
            alt={user?.name}
           
          />
        </figure>
      </div>

      <div className="col-12 col-md-6">
         <h3 style={{color: "grey"}}>Contact Information</h3>
        <div className="container">
        <FontAwesomeIcon icon={faEnvelope} style={{fontSize: "30px", margin: "5px"}}/><b>Email: </b>{user?.gmail}<hr></hr>
        <FontAwesomeIcon icon={faPhone} style={{fontSize: "30px", margin: "5px"}}/><b>Phone NO: </b>{user?.phoneno}<hr></hr>
        <FontAwesomeIcon icon={faContactCard} style={{fontSize: "30px", margin: "5px"}}/><b>Emergency Contact: </b>{user?.father}<hr></hr>
        <FontAwesomeIcon icon={faHome} style={{fontSize: "30px", margin: "5px"}}/><b>Address: </b>{user?.address}<hr></hr>
        </div>
      </div>
        
    </div>
    </div>
    <div className="text-center">
    <Link to="/me/bio_data" className="btn" style={{ backgroundColor: "#fa9c23", fontWeight: "bold", margin: "20px"}}>Bio Data</Link>
      <Link to="/me/profile" className="btn" style={{ backgroundColor: "#fa9c23", fontWeight: "bold", margin: "20px"}}>Back</Link>
      </div>
        </UserLayout>

        </>
    )

}

export default ContactInfo