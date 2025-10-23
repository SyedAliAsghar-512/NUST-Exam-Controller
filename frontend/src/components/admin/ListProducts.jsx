import React, { useEffect, useState } from "react";
import { useDeleteProductMutation, useGetAdminProductsQuery } from "../../redux/api/productsApi";
import toast from "react-hot-toast";
import Loader from "../layouts/loader"
import {MDBDataTable} from "mdbreact"
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faImage,faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from "../layouts/AdminLayout";
import MetaData from "../layouts/MetaData"

const ListProducts = () => {

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

    const params = useParams()

   const { data, isLoading, error } =  useGetAdminProductsQuery()
   const [deleteProduct, {error: deleteError, isLoading: isDeleteLoading, isSuccess}] = useDeleteProductMutation()

   useEffect(() => {

      if(deleteError) {
        toast.error(deleteError?.data?.message)
    } 

    if(isSuccess) {
        toast.success("Product Deleted")
    } 

      if(error) {
          toast.error(error?.data?.message)
      } 
  }, [error,deleteError,isSuccess])

    if (isLoading) return <Loader />

    const setProducts = () => {
        const products = {
            columns: [
            {
                label: "ID",
                field: "id",
                sort: "asc"
            },
            {
                label: "Name",
                field: "name",
                sort: "asc"
            },
            {
                label: "Stock",
                field: "stock",
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

        const submitHandler = (e) => {
            e.preventDefault()
}

const deleteProductHandler = (id) => {
    deleteProduct(id)
}



        data?.product?.forEach((product) => {
            products.rows.push({
                id: product._id,
                name: `${product?.name?.substring(0, 20)}...`,
                stock: product?.stock,
                actions: <>
                <Link to = {`/admin/products/${product?._id}`} className="btn btn-outline-primary">
                <FontAwesomeIcon icon={faPencil} font-size= "30px"/>
                </Link>

                <Link to = {`/admin/products/${product?._id}/upload_images`} className="btn btn-outline-success ms-2">
                <FontAwesomeIcon icon={faImage} font-size= "30px"/>
                </Link>

                <button className="btn btn-outline-danger ms-2" onClick={() => deleteProductHandler(product?._id)} disabled={isDeleteLoading}>
                <FontAwesomeIcon icon={faTrash} font-size= "30px"/>
                </button>
                </>
            })
        })

        return products
    }

    return(
        <>
        <MetaData title="Products List -  Shopholic" />
    <AdminLayout>
        <h1 className="my-5">{data?.product?.length} Products</h1>
        <MDBDataTable 
        data={setProducts()}
        className="px-3"
        bordered
        striped
        hover
        />
    </AdminLayout>
    </>
    )
}

export default ListProducts