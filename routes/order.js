import express from "express";
const router = express.Router();
import {isAuthenticatedUser,  authorizeRoles } from "../backend/middlewares/auth.js"
import { allOrders, deleteOrder, getSales, getSingleOrder, myOrders, newOrder, updateOrder } from "../controllers/orderControllers.js";
import { canUserReview, createProductReview, deleteReview, getProductReviews } from "../controllers/productControllers.js";
import { auDatesheet, editDatesheet, fetchRoomsConfig, getDatesheet, getDatesheets, getRepeatDatesheet, getSubjects, getSubjectsByBatch, myAttendance, myClasses, postRepeatPaper, saveSubjects, updateRoomsConfig } from "../controllers/classesControllers.js";

router.route("/orders/new").post(isAuthenticatedUser, newOrder)
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder)
router.route("/me/classes").get(isAuthenticatedUser, myClasses)
router.route("/me/classes/attendance/:id").get(isAuthenticatedUser, myAttendance)
router.route("/datesheet/:batchId").get(isAuthenticatedUser, getDatesheet)
router.route("/datesheet/batch/*").post(isAuthenticatedUser, authorizeRoles("admin"), postRepeatPaper)
router.route("/audatesheet").post(isAuthenticatedUser, auDatesheet)
router.route("/datesheets").get(isAuthenticatedUser,authorizeRoles("admin"), getDatesheets)
router.route("/postroomsconfig").post(isAuthenticatedUser,authorizeRoles("admin"), updateRoomsConfig)
router.route("/fetchroomsconfig").get(isAuthenticatedUser,authorizeRoles("admin"), fetchRoomsConfig)
router.route("/datesheet/*").get(isAuthenticatedUser,authorizeRoles("admin"), getRepeatDatesheet)
router.route("/datesheets/:id").put(isAuthenticatedUser,authorizeRoles("admin"), editDatesheet)
router.route("/subjects").get(isAuthenticatedUser, getSubjects)
router.route("/subjects/*").get(getSubjectsByBatch)
router.route("/subjects").post(isAuthenticatedUser, saveSubjects)
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), allOrders)
router.route("/admin/orders/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
router.route("/reviews").get(isAuthenticatedUser, getProductReviews).put(isAuthenticatedUser, createProductReview)
router.route("/admin/reviews").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview)
router.route("/admin/getsales").get(isAuthenticatedUser, authorizeRoles("admin"), getSales)

export default router;