import React from "react";
import UserLayout from "../layouts/UserLayout";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MetaData"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmbulance, faCake, faCity, faContactCard, faDroplet, faEnvelope, faGenderless, faHome, faIdCard, faMale, faMarsAndVenus, faPeopleGroup, faPhone, faRing } from '@fortawesome/free-solid-svg-icons';

const BioData = () => {

    const {user} = useSelector((state) => state.auth)

    return (
      <>
            <MetaData title="Profile -  Qalam" />
        <UserLayout>
        <div class="card p-6 rounded" style={{ padding: "10px", }}>
            <div className="row justify-content-around mt-5 user-info">
      <div className="col-12 col-md-5">
      <h3 style={{color: "grey"}}>Personal Details</h3>
      <div className="container">
        <FontAwesomeIcon icon={faCake} style={{fontSize: "30px", margin: "5px"}}/><b>Date Of Birth: </b>{user?.birthday}<hr></hr>
        <FontAwesomeIcon icon={faMarsAndVenus} style={{fontSize: "30px", margin: "5px"}}/><b>Gender: </b>{user?.gender}<hr></hr>
        <FontAwesomeIcon icon={faIdCard} style={{fontSize: "30px", margin: "5px"}}/><b>CNIC: </b>{user?.cnic}<hr></hr>
        <FontAwesomeIcon icon={faCity} style={{fontSize: "30px", margin: "5px"}}/><b>Domicile: </b>{user?.domicile}<hr></hr>
        <FontAwesomeIcon icon={faPeopleGroup} style={{fontSize: "30px", margin: "5px"}}/><b>Religion: </b>{user?.religion}<hr></hr>
        <FontAwesomeIcon icon={faDroplet} style={{fontSize: "30px", margin: "5px"}}/><b>Blood Group: </b>{user?.bloodgroup}<hr></hr>
        </div>
      </div>

      <div className="col-12 col-md-5">
         <h3 style={{color: "grey"}}>Family Details</h3>
        <div className="container">
        <FontAwesomeIcon icon={faMale} style={{fontSize: "30px", margin: "5px"}}/><b>Father Name: </b>{user?.father}<hr></hr>
        <FontAwesomeIcon icon={faPhone} style={{fontSize: "30px", margin: "5px"}}/><b>Father Phone NO: </b>{user?.fatherphoneno}<hr></hr>
        <FontAwesomeIcon icon={faIdCard} style={{fontSize: "30px", margin: "5px"}}/><b>Father CNIC: </b>{user?.fathercnic}<hr></hr>
        <FontAwesomeIcon icon={faAmbulance} style={{fontSize: "30px", margin: "5px"}}/><b>Emergency NO: </b>{user?.emergencyno}<hr></hr>
        <FontAwesomeIcon icon={faRing} style={{fontSize: "30px", margin: "5px"}}/><b>Martial Status: </b>{user?.martial}<hr></hr>
        </div>
      </div>
        
    </div>
    </div>
    <div className="text-center">
    <Link to="/me/contact_info" className="btn" style={{ backgroundColor: "#fa9c23", fontWeight: "bold", margin: "20px"}}>Contact Info</Link>
      <Link to="/me/profile" className="btn" style={{ backgroundColor: "#fa9c23", fontWeight: "bold", margin: "20px"}}>Back</Link>
      </div>
        </UserLayout>

        </>
    )

}

export default BioData