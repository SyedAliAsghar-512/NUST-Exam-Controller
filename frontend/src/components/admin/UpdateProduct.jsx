import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {PRODUCT_CATEGORIES} from "../../constant/constants.js"
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import {useGetProductDetailsQuery, useUpdateProductMutation} from "../../redux/api/productsApi"
import MetaData from "../layouts/MetaData.jsx";

const UpdateProduct = () => {

    const navigate = useNavigate()
    const params = useParams()

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        seller: "",
    })

   const [updateProduct, { isLoading, error, isSuccess }] = useUpdateProductMutation()
   const {data} = useGetProductDetailsQuery(params?.id)
   var {name, description, price, category, stock, seller} = product
   const [color, setColor] = useState("")
   const [textColor, setTextColor] = useState("")
   const savedMode = localStorage.getItem('darkMode') === 'true';

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

   useEffect(() => {

    if (data?.product) {
        setProduct({
            name: data?.product?.name,
            description: data?.product?.description,
            price: data?.product?.price,
            category: data?.product?.category,
            stock: data?.product?.stock,
            seller: data?.product?.seller,
        })
    }

      if(error) {
          toast.error(error?.data?.message)
      } 
      if(isSuccess) {
       toast.success("Product Updated")
       navigate("/admin/products")
      }
  }, [error, isSuccess, data])


    const onChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        updateProduct({id: params?.id, body: product})
    }

    return(
      <>
            <MetaData title="Update Product -  Shopholic" />
<AdminLayout>
   <div className="row wrapper">
      <div className="col-10 col-lg-10 mt-5 mt-lg-0">
        <form className="" style={{ backgroundColor: color}} onSubmit={submitHandler}>
          <h2 className="mb-4">Update Product</h2>
          <div className="mb-3">
            <label htmlFor="name_field" className="form-label"> Name </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description_field" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description_field"
              rows="8"
              name="description"
              value={description}
              onChange={onChange}
            ></textarea>
          </div>

          <div className="row">
            <div className="mb-3 col">
              <label htmlFor="price_field" className="form-label"> Price in Rs</label>
              <input
                type="text"
                id="price_field"
                className="form-control"
                name="price"
                value={price}
                onChange={onChange}
              />
            </div>

            <div className="mb-3 col">
              <label htmlFor="stock_field" className="form-label"> Stock </label>
              <input
                type="number"
                id="stock_field"
                className="form-control"
                name="stock"
                value={stock}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="mb-3 col">
              <label htmlFor="category_field" className="form-label"> Category </label>
              <select className="form-select" id="category_field" name="category" value={category} onChange={onChange}>
              {PRODUCT_CATEGORIES?.map((category) => (
                  <option key={category} value={category}>{category}</option>
              ))}
              </select>
            </div>
            <div className="mb-3 col">
              <label htmlFor="seller_field" className="form-label"> Seller Name </label>
              <input
                type="text"
                id="seller_field"
                className="form-control"
                name="seller"
                value={seller}
                onChange={onChange}
              />
            </div>
          </div>
          <button type="submit" className="btn w-100 py-2" disabled={isLoading}>{isLoading ? "Updating..." : "Update"}</button>
        </form>
      </div>
    </div>
  </AdminLayout>
  </>

    )
}

export default UpdateProduct