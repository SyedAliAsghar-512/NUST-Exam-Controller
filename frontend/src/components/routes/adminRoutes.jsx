import React from "react"
import { Route } from "react-router-dom"
import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import Dashboard from "../admin/Dashboard.jsx";
import ListProducts from "../admin/ListProducts.jsx";
import NewProduct from "../admin/NewProduct.jsx"
import UpdateProduct from "../admin/UpdateProduct.jsx";
import UploadImages from "../admin/UploadImages.jsx";
import ListOrders from "../admin/ListOrders.jsx";
import ProcessOrders from "../admin/ProcessOrders.jsx";
import ListUsers from "../admin/ListUsers.jsx";
import UpdateUser from "../admin/UpdateUser.jsx";
import ProductReviews from "../admin/ProductReviews.jsx";
import RepeatPaperUpload from "../layouts/RepeatPaperCheck.jsx";
import SeatingPlan from "../layouts/SeatingPlan.jsx";
import Subjects from "../admin/Subjects.jsx";
import RoomConfigLayout from "../layouts/RoomConfig.jsx";

const adminRoutes = () => {

    return (
        <>
     <Route path = "/admin/dashboard" element = {
      <ProtectedRoute admin={true}>
        <Dashboard />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/upload_file_semester" element = {
      <ProtectedRoute admin={true}>
        <RepeatPaperUpload />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/rooms_config" element = {
      <ProtectedRoute admin={true}>
        <RoomConfigLayout />
       </ProtectedRoute> 
        } />
                <Route path = "/admin/subject" element = {
      <ProtectedRoute admin={true}>
        <Subjects />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/seating_plan" element = {
      <ProtectedRoute admin={true}>
        <SeatingPlan />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/products" element = {
      <ProtectedRoute admin={true}>
        <ListProducts />
       </ProtectedRoute> 
        } />
      <Route path = "/admin/orders" element = {
      <ProtectedRoute admin={true}>
        <ListOrders />
       </ProtectedRoute> 
        } />
      <Route path = "/admin/product/new" element = {
      <ProtectedRoute admin={true}>
        <NewProduct />
       </ProtectedRoute> 
        } />
      <Route path = "/admin/products/:id" element = {
      <ProtectedRoute admin={true}>
        <UpdateProduct />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/orders/:id" element = {
      <ProtectedRoute admin={true}>
        <ProcessOrders />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/users/:id" element = {
      <ProtectedRoute admin={true}>
        <UpdateUser />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/users/" element = {
      <ProtectedRoute admin={true}>
        <ListUsers />
       </ProtectedRoute> 
        } />
        <Route path = "/admin/reviews" element = {
      <ProtectedRoute admin={true}>
        <ProductReviews />
       </ProtectedRoute> 
        } />
    <Route path = "/admin/products/:id/upload_images" element = {
      <ProtectedRoute admin={true}>
        <UploadImages />
       </ProtectedRoute> 
        } />
        </>
    )

}

export default adminRoutes