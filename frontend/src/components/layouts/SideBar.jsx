import React, { useEffect, useRef, useState } from "react";
import "../../App.css"
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faBagShopping, faClock, faCode, faComment, faDashboard, faEraser, faFileInvoice, faFileInvoiceDollar, faHome, faMessage, faProjectDiagram, faSheetPlastic, faSuitcase, faUpload } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`} ref={sidebarRef}>
      <div className="toggle-button" onClick={toggleSidebar}>
      <div class="bar"></div>
  <div class="bar"></div>
  <div class="bar"></div>
      </div>
      <div className="sidebar">
        <ul className="menu">
         <li><FontAwesomeIcon icon={faDashboard} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/dashboard"} style={{color: "white"}}>Dashboard</Link></li>
          <li><FontAwesomeIcon icon={faA} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/attendance"} style={{color: "white"}}>Attendance</Link></li>
          <li><FontAwesomeIcon icon={faSheetPlastic} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/results"} style={{color: "white"}}>Results & Exams</Link></li>
          <li><FontAwesomeIcon icon={faMessage} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/notifications"} style={{color: "white"}}>Notification</Link></li>
          <li><FontAwesomeIcon icon={faBagShopping} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/enrollments"} style={{color: "white"}}>Enrollments</Link></li>
          <li><FontAwesomeIcon icon={faEraser} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/feedbacks"} style={{color: "white"}}>Feedbacks</Link></li>
          <li><FontAwesomeIcon icon={faClock} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/timetable"} style={{color: "white"}}>Time Table</Link></li>
          <li><FontAwesomeIcon icon={faUpload} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/requests"} style={{color: "white"}}>Requests</Link></li>
          <li><FontAwesomeIcon icon={faFileInvoice} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/messinvoices"} style={{color: "white"}}>Mess Invoices</Link></li>
          <li><FontAwesomeIcon icon={faFileInvoiceDollar} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/invoices"} style={{color: "white"}}>Invoices</Link></li>
          <li><FontAwesomeIcon icon={faComment} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/advisory"} style={{color: "white"}}>Student Advisory</Link></li>
          <li><FontAwesomeIcon icon={faHome} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/hostel"} style={{color: "white"}}>Hostel</Link></li>
          <li><FontAwesomeIcon icon={faProjectDiagram} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/me/projects"} style={{color: "white"}}>Projects</Link></li>
          <li><FontAwesomeIcon icon={faCode} style={{fontSize: "20px", color: "white"}}/><Link className="btn" to={"/me/internship"} style={{color: "white"}}>Internship Program</Link></li>
          <li><FontAwesomeIcon icon={faBagShopping} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/councelling"} style={{color: "white"}}>C3A Councelling</Link></li>
          <li><FontAwesomeIcon icon={faBagShopping} style={{fontSize: "30px", color: "white"}}/><Link className="btn" to={"/thesis"} style={{color: "white"}}>MS Thesis</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
