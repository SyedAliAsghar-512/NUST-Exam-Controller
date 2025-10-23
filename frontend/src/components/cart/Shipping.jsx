import React, { useEffect, useState } from "react"
import { countries } from "countries-list"
import { useDispatch, useSelector } from "react-redux"
import { saveShippingInfo } from "../../redux/features/cartSlice"
import { useNavigate } from "react-router-dom"
import CheckoutSteps from "./CheckoutSteps"
import MetaData from "../layouts/MetaData"

const Shipping = () => {

  const countriesList = Object.values(countries)

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [phoneNo, setPhoneNo] = useState("")
    const [country, setCountry] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { shippingInfo } = useSelector((state) => state.cart)

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

    useEffect(() => {
          if(shippingInfo) {
              setAddress(shippingInfo?.address)
              setCity(shippingInfo?.city)
              setZipCode(shippingInfo?.zipCode)
              setPhoneNo(shippingInfo?.phoneNo)
              setCountry(shippingInfo?.country)
          }
    },[shippingInfo])

    const submitHandler = (e) => {
      e.preventDefault()

      dispatch(saveShippingInfo({ address, city, zipCode, phoneNo, country }))
      navigate("/confirm_order")
        
    }
    
    return (
        <>
              <MetaData title="Shipping -  Shopholic" />
        <CheckoutSteps shipping/>
         <div className="row wrapper mb-5">
      <div className="col-10 col-lg-5">
        <form
          style={{ backgroundColor: color}}
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Shipping Info</h2>
          <div className="mb-3">
            <label htmlFor="address_field" className="form-label">Address</label>
            <input
              type="text"
              id="address_field"
              className="form-control"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="city_field" className="form-label">City</label>
            <input
              type="text"
              id="city_field"
              className="form-control"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_field" className="form-label">Phone No</label>
            <input
              type="tel"
              id="phone_field"
              className="form-control"
              name="phoneNo"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="zip_code_field" className="form-label"
              >Zip Code</label>
            <input
              type="number"
              id="postal_code_field"
              className="form-control"
              name="postalCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="country_field" className="form-label">Country</label>
            <select
              id="country_field"
              className="form-select"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
             {countriesList?.map((country) => (
               <option key={country?.name} value={country?.name}>{country?.name}</option>
             ))} 
            </select>
          </div>

          <button id="shipping_btn" type="submit" className="btn w-100 py-2">
            CONTINUE
          </button>
        </form>
      </div>
    </div>

        </>
    )
}

export default Shipping