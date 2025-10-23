import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCircle, faLock, faTachometerAlt, faPlusCircle, faBagShopping, faReceipt, faUserAlt, faStar } from '@fortawesome/free-solid-svg-icons';


const SideMenu = ({ menuItem }) => {

  const [color, setColor] = useState("")
  const [textColor, setTextColor] = useState("")
  const savedMode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    if(savedMode) {
       setColor("#0e1011")
       setTextColor("white")
    }
      else {
         setColor("white")
         setTextColor("black")
      }

  })


  const iconMap = {
    faUser,
    faUserCircle,
    faLock,
    faTachometerAlt,
    faPlusCircle,
    faBagShopping,
    faReceipt,
    faUserAlt,
    faStar,
  };

    const location = useLocation()
     
    const [activeMenuItem, setActiveMenuItem] = useState(location.pathname)

    const handleMenuClickItem = (menuItemurl) => {
      setActiveMenuItem(menuItemurl)
    }

    return (
<>

  <div className="list-group mt-5 pl-4" >

        {menuItem?.map((menuItem, index) => (

      <Link
       key={index}
       to={menuItem.url}
       style={{ backgroundColor: color, color: textColor}}
       onClick={() => handleMenuClickItem(menuItem.url)}
       className={`fw-bold list-group-item list-group-item-action ${activeMenuItem.includes(menuItem.url) ? "active": ""}`}
       aria-current={`fw-bold list-group-item list-group-item-action ${activeMenuItem.includes(menuItem.url) ? "true": "false"}`}
        > 
       <FontAwesomeIcon icon={iconMap[menuItem.icon]} />      {menuItem.name}
      </Link>
        ))}
  </div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://kit.fontawesome.com/9edb65c86a.js"></script>

</>

)

}

export default SideMenu