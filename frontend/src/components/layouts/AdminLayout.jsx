import React, { useEffect, useState } from "react";
import SideMenu from "./SideMenu";

const AdminLayout = ({children}) => {

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

    const menuItem = [

        {
          name: "Dashboard",
          url: "/admin/dashboard",
          icon: "faTachometerAlt",
        },
  
        {
          name: "New Product",
          url: "/admin/product/new",
          icon: "faPlusCircle",
        },
  
        {
          name: "Products",
          url: "/admin/products",
          icon: "faBagShopping",
        },
  
        {
          name: "Orders",
          url: "/admin/orders",
          icon: "faReceipt",
        },
        {
            name: "Users",
            url: "/admin/users",
            icon: "faUserAlt",
          },
          {
            name: "Reviews",
            url: "/admin/reviews",
            icon: "faStar",
          },
  
      ]

    return(
                <>
                
                   <div className="mt-2 mb-4 py-4">
                    <h2 className="text-center fw-bolder">Admin Dashboard</h2>
        
                   <div className="container">
                    <div className="row justify-content-around">
                        <div className="col-12 col-lg-3" >
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
        
export default AdminLayout