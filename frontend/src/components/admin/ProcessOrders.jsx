import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useOrderDetailsQuery, useUpdateOrderMutation } from "../../redux/api/orderApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MetaData";

const ProcessOrders = () => {

    const params  = useParams()
    const [status, setStatus] = useState("")
    const {data} = useOrderDetailsQuery(params?.id)
    const order = data?.order || {}
    const [updateOrder, { error, isSuccess }] = useUpdateOrderMutation()

    const {shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus} = order
    const isPaid = paymentInfo?.status === "paid" ? true : false

    useEffect(() => {
        if(orderStatus) {
            setStatus(orderStatus)
        }
    }, [orderStatus])

    useEffect(() => {

        if(error) {
            toast.error(error?.data?.message)
        } 
        if(isSuccess) {
            toast.success("Order Status Updated")
        } 
    }, [error, isSuccess, orderStatus])

    const updateProductHandler = (id) => {
        const data = { status }
        updateOrder({id, body: data})
    }

  return(
    <>
    <MetaData title="Processing Order - Shopholic " />
    <AdminLayout>
    <div className="row d-flex justify-content-center">
    <div className="col-12 col-lg-9 mt-5 order-details">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mt-5 mb-4">Your Order Details</h3>
      </div>

      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">ID</th>
            <td>{order?._id}</td>
          </tr>
          <tr>
            <th scope="row">Order Status</th>
            <td className={String(orderStatus).includes["Delivered"] ? "greenColor" : "redColor"}>
                  <b>{orderStatus}</b>
                </td>
          </tr>
          <tr>
            <th scope="row">Date</th>
            <td>October 1, 2023, 10:30 AM</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-5 mb-4">Shipping Info</h3>
      <table className="table table-striped table-bordered">
      <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>{shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.zipCode}, {shippingInfo?.country}</td>
              </tr>
            </tbody>
      </table>

      <h3 className="mt-5 mb-4">Payment Info</h3>
      <table className="table table-striped table-bordered">
      <tbody>
              <tr>
                <th scope="row">Status</th>
                <td className={isPaid ? "greenColor" : "redColor"}>
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{order?.paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Stripe ID</th>
                <td>{paymentInfo?.id || "Nil"}</td>
              </tr>
              <tr>
                <th scope="row">Amount Paid</th>
                <td>Rs {totalPrice}</td>
              </tr>
            </tbody>
      </table>

      <h3 className="mt-5 my-4">Order Items:</h3>

      <hr />
      <div className="cart-item my-1">
      {orderItems?.map((item) => (
            <div className="row my-5">
            <div className="col-4 col-lg-2">
              <img
                src={item?.image}
                alt={item?.name}
                height="45"
                width="65"
              />
            </div>

            <div className="col-5 col-lg-5">
              <Link to={`/product/${item?.product}`}>{item?.name}</Link>
            </div>

            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
              <p>Rs {item?.price}</p>
            </div>

            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
              <p>{item?.quantity} Piece(s)</p>
            </div>
          </div>
            ))}

      </div>
      <hr />
    </div>
    <div className="col-12 col-lg-3 mt-5">
        <h4 className="my-4">Status</h4>

        <div className="mb-3">
            <select className="form-select" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
            </select>
        </div>

      <button className="btn btn-primary w-100" onClick={() => updateProductHandler(order?._id)}>Update Status</button>

      <h4 className="mt-5 mb-3">Order Invoice</h4>
      <Link to={`/invoice/order/${order?._id}`} className="btn btn-success w-100">
        <i className="fa fa-print"></i> Generate Invoice
      </Link>
    </div>
  </div>
  </AdminLayout>
  </>

  )
}

export default ProcessOrders