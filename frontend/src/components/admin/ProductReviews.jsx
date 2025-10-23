import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useLazyGetProductReviewsQuery } from "../../redux/api/productsApi";
import toast from "react-hot-toast";
import Loader from "../layouts/loader"
import {MDBDataTable} from "mdbreact"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash } from '@fortawesome/free-solid-svg-icons';
import MetaData from "../layouts/MetaData.jsx"

const ProductReviews = () => {

    const [productId, setProductId] = useState("")
    const [getProductReviews, {data, error, isLoading}] = useLazyGetProductReviewsQuery()

    useEffect(() => {

        if(error) {
            toast.error(error?.data?.message)
        } 
  
    }, [error])

    const submitHandler = (e) => {
        e.preventDefault()
        getProductReviews(productId)

    }

    const setReviews = () => {
        const reviews = {
            columns: [
            {
                label: "Review ID",
                field: "id",
                sort: "asc"
            },
            {
                label: "Rating",
                field: "rating",
                sort: "asc"
            },
            {
                label: "Comment",
                field: "comment",
                sort: "asc"
            },        
            {
                label: "User",
                field: "user",
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

        data?.reviews?.forEach((review) => {
            reviews.rows.push({
                id: review._id,
                rating: review?.rating,
                comment: review?.comment,
                user: review?.user?.name,
                actions: <>

                <button className="btn btn-outline-danger ms-2"  >
                <FontAwesomeIcon icon={faTrash} font-size= "30px"/>
                </button>
                </>
            })
        })

        return reviews
    }

    return(
      <>
            <MetaData title="Product Reviews -  Shopholic" />
        <AdminLayout>
            <div class="row justify-content-center my-5">
      <div class="col-6">
        <form onSubmit={submitHandler}>
          <div class="mb-3">
            <label for="productId_field" class="form-label">
              Enter Product ID
            </label>
            <input
              type="text"
              id="productId_field"
              class="form-control"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <button
            id="search_button"
            type="submit"
            class="btn btn-primary w-100 py-2"
          >
            SEARCH
          </button>
        </form>
      </div>
    </div>
  {data?.reviews?.length > 0 ? (
    <MDBDataTable 
        data={setReviews()}
        className="px-3"
        bordered
        striped
        hover
        />
   ) : (<p className="mt-5 text-center">No Reviews</p> )}
        </AdminLayout>
        </>
    )
}

export default ProductReviews