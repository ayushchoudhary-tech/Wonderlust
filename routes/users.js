const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");

//signup form
router.route("/signup")
  .get(userController.renderSignupForm )
//adding user
 .post(
wrapAsync(userController.signup));
//login from
router.route("/login")
 .get(userController.renderLoginFrom )
 //user loggin in
 .post(saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
userController.login);

//user logout
router.get("/logout",userController.logout);



module.exports = router;