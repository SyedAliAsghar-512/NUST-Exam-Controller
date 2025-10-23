import React, { useEffect, useState } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../layouts/loader"
import {MDBDataTable} from "mdbreact"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import MetaData from "../layouts/MetaData"

const MyOrders = () => {

   const { data, isLoading, error } =  useMyOrdersQuery()
   const [searchParams] = useSearchParams()
   const orderSuccess = searchParams.get("order_success")
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [color, setColor] = useState("")
   const [textColor, setTextColor] = useState("")
   const savedMode = localStorage.getItem('darkMode') === 'true';
   

   useEffect(() => {
      if(error) {
          toast.error(error?.data?.message)
      } 
      if (orderSuccess) {
        dispatch(clearCart())
        navigate("/me/orders?order_success=true")
      }
  }, [error, orderSuccess])

  useEffect(() => {
    if(savedMode) {
       setColor("black")
       setTextColor("white")
    }
      else {
         setColor("white")
         setTextColor("black")
      }

  })

    if (isLoading) return <Loader />

    const setOrders = () => {
        const orders = {
            columns: [
            {
                label: "ID",
                field: "id",
                sort: "asc"
            },
            {
                label: "Amount Paid",
                field: "amount",
                sort: "asc"
            },
            {
                label: "Payment Status",
                field: "status",
                sort: "asc"
            },
            {
                label: "Order Status",
                field: "orderStatus",
                sort: "asc"
            },            
            {
                label: "Actions",
                field: "actions",
                sort: "asc"
            },
        ],
            rows: [],
        }

        data?.orders?.forEach((order) => {
            orders.rows.push({
                id: order._id,
                amount: `Rs ${order?.totalPrice}`,
                status: order?.paymentInfo?.status?.toUpperCase(),
                orderStatus: order?.orderStatus,
                actions: <>
                <Link to = {`/me/order/${order?._id}`} className="btn btn-primary">
                <FontAwesomeIcon icon={faEye} font-size= "30px"/>
                </Link>

                <Link to = {`/invoice/order/${order?._id}`} className="btn btn-success ms-2">
                <FontAwesomeIcon icon={faPrint} font-size= "30px"/>
                </Link>
                </>
            })
        })

        return orders
    }

    return(
        <>
              <MetaData title="My Orders -  Shopholic" />
    <div className={savedMode ? 'dark-mode' : 'light-mode'}>
        <h1 className="my-5">{data?.orders?.length} ORDERS</h1>
        <MDBDataTable 
        data={setOrders()}
        className="px-3"
        bordered
        striped
        hover
        dark={savedMode}
        />
    </div>
    </>
    )
}

export default MyOrders