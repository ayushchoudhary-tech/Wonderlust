const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressErrors.js");

const {validateReview,isLoggedIn, isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


// add reviews-->post 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
//delete -->review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;