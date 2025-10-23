import express from "express";
import {isAuthenticatedUser, authorizeRoles} from "../backend/middlewares/auth.js"
import { updateProduct,deleteProduct, getProductDetails, getProducts, newProducts, check, getAdminProducts, uploadProductImages, deleteProductImage } from "../controllers/productControllers.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/check").get(check);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct);
router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin"), getAdminProducts);
router.route("/admin/products/:id/delete").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProduct);
router.route("/admin/newproduct").post(isAuthenticatedUser,authorizeRoles("admin"), newProducts);
router.route("/admin/products/:id/upload_images").put(isAuthenticatedUser,authorizeRoles("admin"), uploadProductImages);
router.route("/admin/products/:id/delete_images").put(isAuthenticatedUser,authorizeRoles("admin"), deleteProductImage);

export default router;