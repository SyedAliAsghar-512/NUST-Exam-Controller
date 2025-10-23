import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { calculateOrderCost } from "../helpers/helpers";
import CheckoutSteps from "./CheckoutSteps";
import MetaData from "../layouts/MetaData";

const ConfirmOrder = () => {

    const { cartItems, shippingInfo } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.auth)

    const { itemsPrice, shippingPrice, totalPrice } = calculateOrderCost(cartItems)

    const navigate = useNavigate()

    const proceedToPaymentHandler = () => {
        navigate("/payment")
    }

    return (
        <>
              <MetaData title="Confirm Order -  Shopholic" />
        <CheckoutSteps shipping confirmOrder/>
        <div className="row d-flex justify-content-between">
      <div className="col-12 col-lg-8 mt-5 order-confirm">
        <h4 className="mb-3">Shipping Info</h4>
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Phone:</b> {shippingInfo?.phoneNo}</p>
        <p className="mb-4">
          <b>Address:</b> {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.zipCode}, {shippingInfo?.country}
        </p>

        <hr />
        <h4 className="mt-4">Your Cart Items:</h4>
         {cartItems?.map((item) => (
            <>
             <hr />
        <div className="cart-item my-1">
          <div className="row">
            <div className="col-4 col-lg-2">
              <img
                src={item?.image}
                alt={item?.name}
                height="45"
                width="65"
              />
            </div>

            <div className="col-5 col-lg-6">
              <Link to={`/product/${item.product}`}>{item?.name}</Link>
            </div>

            <div className="col-4 col-lg-4 mt-4 mt-lg-0">
              <p>{item?.quantity} x Rs {item?.price} = <b>Rs {(item?.quantity * item.price).toFixed(2)}</b></p>
            </div>
          </div>
        </div>
        <hr />
      
 </>
         ))}
       </div>
      <div className="col-12 col-lg-3 my-4">
        <div id="order_summary">
          <h4>Order Summary</h4>
          <hr />
          <p>Subtotal: <span className="order-summary-values">Rs {itemsPrice}</span></p>
          <p>Shipping: <span className="order-summary-values">Rs {shippingPrice}</span></p>
          <p>Tax: <span className="order-summary-values">Rs 0</span></p>

          <hr />

          <p>Total: <span className="order-summary-values">Rs {totalPrice}</span></p>

          <hr />
          <a href="/payment" id="checkout_btn" className="btn btn-primary w-100" onClick={proceedToPaymentHandler}>
            Proceed to Payment
          </a>
        </div>
      </div>
    </div>
    </>
    )
}

export default ConfirmOrder