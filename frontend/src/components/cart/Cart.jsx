import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCartItem, removeCartItem } from "../../redux/features/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import MetaData from "../layouts/MetaData";

const Cart = () => {
    
    const {cartItems} = useSelector((state) => state.cart)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const increaseQty = (item, quantity) => {
        const newQty = quantity + 1
     
        if (newQty > item?.stock) return
     
        setItemToCart(item, newQty)
     }
     
     const decreaseQty = (item, quantity) => {
     
        const newQty = quantity - 1
     
        if (newQty <= 0) return
     
        setItemToCart(item, newQty)
     }

     const [color, setColor] = useState("")
     const [textColor, setTextColor] = useState("")
     const savedMode = localStorage.getItem('darkMode') === 'true';
   
     useEffect(() => {
       if(savedMode) {
          setColor("black")
          setTextColor("white")
          setCartItem({})
       }
         else {
            setColor("white")
            setTextColor("black")
            setCartItem({})
         }
   
     })
     
     const setItemToCart = (item, newQty) => {
       const cartItem = {
         product: item?.product,
         name: item?.name,
         price: item?.price,
         image: item?.image,
         stock: item?.stock,
         quantity: newQty,
       }
       dispatch(setCartItem(cartItem))
       toast.success("Cart Updated.")
     }

     const removeCartItemHandler = (id) => {
        dispatch(removeCartItem(id))
     }

     const checkoutHandler = () => {
        navigate("/shipping")
     }
 

    return (
    <>
    <MetaData title="Cart - Shopholic" />
      {cartItems?.length == 0 ? (
    <h2 className="mt-5">Your Cart is Empty.</h2>
      ) : (
        <>
        <h2 className="mt-5">Your Cart: <b>{cartItems?.length} items</b></h2>
    <div className="row d-flex justify-content-between">
      <div className="col-12 col-lg-8">
        {cartItems?.map((item) => (
            <>
            <hr />
        <div className="cart-item" data-key="product1">
          <div className="row">
            <div className="col-4 col-lg-3">
              <img
                src={item?.image}
                alt={item?.name}
                height="90"
                width="115"
              />
            </div>
            <div className="col-5 col-lg-3">
              <Link to={`/product/${item?.product}`}>{item?.name}</Link>
            </div>
            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
              <p id="card_item_price">Rs {item?.price}</p>
            </div>
            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={() => decreaseQty(item, item.quantity)}> - </span>
                <input
                  type="number"
                  className="form-control count d-inline"
                  value={item?.quantity}
                  readonly
                />
                <span className="btn btn-primary plus" onClick={() => increaseQty(item, item.quantity)}> + </span>
              </div>
            </div>
            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
              <button id="delete_cart_item" style={{ backgroundColor: color}} onClick={() => removeCartItemHandler(item?.product)}><FontAwesomeIcon icon={faTrash} font-size= "30px"/></button>
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
          <p>Subtotal: <span className="order-summary-values">{cartItems?.reduce((acc, item) => acc + item?.quantity, 0)}{" "} (Units)</span></p>
          <p>Est. total: <span className="order-summary-values">Rs {cartItems?.reduce((acc, item) => acc + item?.quantity * item.price, 0).toFixed(2)}</span></p>
          <hr />
          <button id="checkout_btn" className="btn btn-primary w-100" onClick={checkoutHandler}>
            Check out
          </button>
        </div>
      </div>
    </div>
    </>
      )}
</>
    )
}

export default Cart