import React, { useState, useEffect } from 'react';
import Loader from '../loader.jsx';
import toast from 'react-hot-toast';
import { useGetProductDetailsQuery } from '../../../redux/api/productsApi.js';
import { useParams } from 'react-router-dom';
import { name } from '@cloudinary/url-gen/actions/namedTransformation';
import { useDispatch, useSelector } from 'react-redux';
import {setCartItem} from "../../../redux/features/cartSlice.js"
import NewReview from '../../reviews/NewReviews.jsx';
import StarRatings from 'react-star-ratings';
import ListReviews from "../../reviews/ListReviews.jsx"
import NotFound from "../NotFound.jsx"
import MetaData from '../MetaData.jsx';

const ProductDetails = () => {
const params = useParams()
const dispatch = useDispatch()
const [quantity, setQuantity] = useState(1)
const { isAuthenticated } = useSelector((state) => state.auth)
const {data, isLoading, error, isError} = useGetProductDetailsQuery(params?.id)
const product = data?.product
const [activeImg, setActiveImg] = useState(' ')

useEffect(() => {
  setActiveImg (product?.images[0])
}, [product])

useEffect(() => {
  if (isError) {toast.error(error?.data?.message)}
}, [isError])

const increaseQty = () => {
   const count = document.querySelector(".count")

   if (count.valueAsNumber >= product?.stock) return

   const qty = count.valueAsNumber + 1
   setQuantity(qty)
}

const decreaseQty = () => {

  const count = document.querySelector(".count")

   if (count.valueAsNumber <= 1) return

   const qty = count.valueAsNumber - 1
   setQuantity(qty)
}

const setItemToCart = () => {
  const cartItem = {
    product: product?._id,
    name: product?.name,
    price: product?.price,
    image: product?.images[0]?.url,
    stock: product?.stock,
    quantity
  }
  dispatch(setCartItem(cartItem))
  toast.success("Item added to cart.")
}


if (isLoading) return <Loader />

if(error && error?.status == 404 ) {
  return <NotFound />
}
    return (
   <>
         <MetaData title="Product Details -  Shopholic" />
    <div class="row d-flex justify-content-around">
      <div class="col-12 col-lg-5 img-fluid" id="product_image">
        <div class="p-3">
          <img
            class="d-block w-100"
            src={product?.images[0]?.url}
            alt=""
            width="340"
            height="390"
          />
        </div>
        <div class="row justify-content-start mt-5">
          {product?.images?.map((img) => (
          <div class="col-2 ms-4 mt-2">
            <a role="button">
              <img
                class= {`d-block border rounded p-3 cursor-pointer ${product?.images?.url === activeImg ? "border-warning": ""} `}
                height="100"
                width="100"
                src={img?.url}
                alt={img?.url}
              />
            </a>
          </div>

          ))}
        </div>
      </div>

      <div class="col-12 col-lg-5 mt-5">
        <h3>{product?.name}</h3>
        <p id="product_id">{product?.id}</p>

        <hr />

        <div className='StarRating'>
                <StarRatings
                rating={product.ratings}
                starRatedColor='yellow'
                numberOfStars={5}
                name='rating'
                starDimension='24px'
                starSpacing='1px'
                />
                </div>
                <span id='no_of_reviews' className='pt-2 ps-2'>
                  {" "}
                  ({product?.numOfReviews})
                </span>
                
        <hr />

        <p id="product_price">Rs {product?.price}</p>
        <div class="stockCounter d-inline">
          <span class="btn btn-danger minus" onClick={decreaseQty}>-</span>
          <input
            type="number"
            class="form-control count d-inline"
            value={quantity}
            readonly
          />
          <span class="btn btn-primary plus" onClick={increaseQty}>+</span>
        </div>
        <button
          type="button"
          id="cart_btn"
          class="btn btn-primary d-inline ms-4"
          disabled={product?.stock <= 0}
          onClick={setItemToCart}
        >
          Add to Cart
        </button>

        <hr />

        <p>
          Status: <span id="stock_status" class="greenColor">In Stock</span>
        </p>

        <hr />

        <h4 class="mt-2">Description:</h4>
        <p>
          {product?.description}
        </p>
        <hr />
        <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>
       {isAuthenticated ? (<NewReview productId={product?._id}/>) : (
        <div class="alert alert-danger my-5" type="alert">
          Login to post your review.
        </div>
        )}
      </div>
      </div>
     {product?.reviews?.length  > 0 && <ListReviews reviews= {product?.reviews}/> }
     </>
    )
}

export default ProductDetails