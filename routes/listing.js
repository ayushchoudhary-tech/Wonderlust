const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listings.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");

const upload=multer({storage});
//index route
router.route("/")
 .get(wrapAsync(listingController.index))
    //create route
 .post(isLoggedIn,
   upload.single('listing[image]'),
   validateListing,
wrapAsync(listingController.createListing ));
 
//add new 
router.get("/new",isLoggedIn,listingController.addNewListing
);

//router route
router.route("/:id")
 //show listing
 .get( wrapAsync(listingController.showListings))
  //update listing
 .put(isLoggedIn,isOwner,
 upload.single('listing[image]'),
 validateListing,
 wrapAsync(listingController.updateListing))
 // delete listing
 .delete(isLoggedIn,isOwner,
wrapAsync(listingController.destroyListing));


//edit route 
router.get("/:id/edit",isLoggedIn,isOwner,
wrapAsync(listingController.editListing));



module.exports=router;