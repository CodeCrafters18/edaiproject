import {Router} from "express";
import { VerifyUserdetails,registerUser,loginUser,addStorage, logoutUser,billingDetails,searchProduct, orders, PersonalStorageSearch, UniversalStorageSearch } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/payment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(VerifyUserdetails)
router.route("/login").post(loginUser)
router.route("/createuser").post(registerUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.post(
    '/addstorage',
    upload.fields([{ name: 'productImages[]', maxCount: 5 }]),
    addStorage
  );
  
router.route("/billingdetails").post(verifyJWT,billingDetails);
router.route("/orders").get(verifyJWT,orders);
router.route("/products/search").get(searchProduct)
// router.route("/myproducts").get(verifyJWT,myproducts);
router.route("/getstorage").get(verifyJWT,PersonalStorageSearch);
router.route("/findstorage").get(verifyJWT,UniversalStorageSearch);

export default router;