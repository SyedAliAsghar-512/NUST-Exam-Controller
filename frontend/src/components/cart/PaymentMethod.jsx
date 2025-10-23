import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { calculateOrderCost } from "../helpers/helpers";
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import {clearCart } from "../../redux/features/cartSlice";

const PaymentMethod = () => {

    const [paymentMethod, setPaymentMethod] = useState("")
    const { shippingInfo, cartItems } = useSelector((state) => state.cart)
    const { itemsPrice, shippingPrice, totalPrice } = calculateOrderCost(cartItems)
    const navigate = useNavigate()
    const [ createNewOrder ,{ error, isSuccess } ] = useCreateNewOrderMutation()
    const [stripeCheckoutSession, {data: checkoutdata, error: checkoutError, isLoading}] = useStripeCheckoutSessionMutation()
    const dispatch = useDispatch()

    const [color, setColor] = useState("")
    const [textColor, setTextColor] = useState("")
    const savedMode = localStorage.getItem('darkMode') === 'true';
  
    useEffect(() => {
      if(savedMode) {
         setColor("#0e1011")
         setTextColor("white")
      }
        else {
           setColor("#efeeee")
           setTextColor("black")
        }
  
    })

    useEffect(() => {
      if (checkoutdata) {
        window.location.href = checkoutdata?.url
      }

       if (checkoutError) {
             toast.error(checkoutError?.data?.message)
       }

    },[checkoutdata, checkoutError])

    useEffect(() =>{
        if (error) {
            toast.error(error?.data?.message)
        }

        if (isSuccess) {
            navigate("/me/orders?order_success=true")
            dispatch(clearCart())
            toast.success("Order Placed")
        }

    }, [error, isSuccess, navigate])

    const submitHandler = (e) => {
     e.preventDefault()

     if(paymentMethod === "") {
      toast.error("Choose Payment Method First")
     }

    if (paymentMethod === "COD") {
       const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentMethod: "COD",
        paymentInfo: {
            status: "Not Paid",
        },
       }
       createNewOrder(orderData) 
    }

    if (paymentMethod === "Card") {
     const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
       }
       stripeCheckoutSession(orderData)  
      
      // toast.error("Service is unavailable right now.")
      }

    }

    return (
        <>
              <MetaData title="Payment Method -  Shopholic" />
        <CheckoutSteps shipping confirmOrder payment/>
        <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
         style={{ backgroundColor: color}}
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={(e) => setPaymentMethod("COD")}
            />
            <label className="form-check-label" htmlFor="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
              onChange={(e) => setPaymentMethod("Card")}
            />
            <label className="form-check-label" htmlFor="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
            {isLoading ? "Proceeding..." : "Proceed To Pay"}
          </button>
        </form>
      </div>
    </div>
    </>
    )
}

export default PaymentMethod