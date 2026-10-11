const Listing=require("./models/listings");
const ExpressError=require("./utils/ExpressErrors.js");
const {listingSchema,reviewSchema}=require("./schema.js"); 
const Review=require("./models/review");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    { req.session.redirectUrl =req.originalUrl;
        req.flash("error","please login");
       return  res.redirect("/login");
    }
    next();
};
 
//passport deleted info after login so savin the info to local storage

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
};


//middleware to check current owner is owner of listing or not
module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
   let listing =await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.currUser._id))
   {
     req.flash("error","only owner can edit");
     return  res.redirect(`/listings/${id}`);
   } next();
};

// authenticatior for review
module.exports.isAuthor= async(req,res,next)=>{
    let { id,reviewId}=req.params;
   let review =await Review.findById(reviewId);
   if(!review.author._id.equals(res.locals.currUser._id))
   {
     req.flash("error","only author can edit");
     return  res.redirect(`/listings/${id}`);
   } next();
};




// validating schema ->middleware
module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error)
    { let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

 //validating reviews->schema
module.exports.validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error)
    { let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

