import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../layouts/loader"
import {MDBDataTable} from "mdbreact"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from "../layouts/AdminLayout";
import { useDeleteOrderMutation, useGetAdminOrdersQuery } from "../../redux/api/orderApi";
import MetaData from "../layouts/MetaData"

const ListOrders = () => {

   const { data, isLoading, error } =  useGetAdminOrdersQuery()

   const [deleteOrder, {error: deleteError, isSuccess, isLoading: deleteLoading}] = useDeleteOrderMutation()

   useEffect(() => {

      if(error) {
          toast.error(error?.data?.message)
      } 
      if(deleteError) {
        toast.error(deleteError?.data?.message)
      }
      if(isSuccess) {
        toast.success("Product Deleted")
      }
  }, [error, deleteError, isSuccess])

    if (isLoading) return <Loader />

    const deleteOrderHandler = (id) => {
        deleteOrder(id)
    }

    const setOrders = () => {
        const orders = {
            columns: [
            {
                label: "ID",
                field: "id",
                sort: "asc"
            },
            {
                label: "Payment Status",
                field: "paymentStatus",
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
                paymentStatus: order?.paymentInfo.status.toUpperCase(),
                orderStatus: order?.orderStatus,
                actions: <>
                <Link to = {`/admin/orders/${order?._id}`} className="btn btn-outline-primary">
                <FontAwesomeIcon icon={faPencil} font-size= "30px"/>
                </Link>

                <button className="btn btn-outline-danger ms-2" onClick={() => deleteOrderHandler(order?._id)} disabled={deleteLoading} >
                <FontAwesomeIcon icon={faTrash} font-size= "30px"/>
                </button>
                </>
            })
        })

        return orders
    }

    return(
        <>        <MetaData title="Order List - Shopholic" />
    <AdminLayout>
        <h1 className="my-5">{data?.orders?.length} Orders</h1>
        <MDBDataTable 
        data={setOrders()}
        className="px-3"
        bordered
        striped
        hover
        />
    </AdminLayout>
    </>
    )
}

export default ListOrders