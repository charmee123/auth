import { Router } from "express";
const router = Router();

//Import all conrollers
import * as controller from '../controllers/appController.js';
import { registerMail } from "../controllers/mailer.js";
import Auth,{localVariables} from "../middleware/auth.js";


// post routes
router.route('/signup').post(controller.signup); //register user
router.route('/registerMail').post(registerMail);       //send the mail
router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end());       //authenticate user
router.route('/login').post(controller.verifyUser, controller.login);              //login in the app

//Get methods
router.route('/user/:email').get(controller.getUser);      //user with email
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);         //generate random OTP
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP)             //verify generated OTP
router.route('/createResetSession').get(controller.createResetOTP)   //create all the variables

//put methods
router.route('/updateuser').put(Auth,controller.updateUser);          //update the user profile
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);       //use to reset password





export default router;