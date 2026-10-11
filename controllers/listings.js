const Listing=require("../models/listings");
const {categories,categoryValues,randomCategories}=require("../utils/categories.js");


//index -->optional ?category= filter
module.exports.index=async (req,res)=>{
   let {category}=req.query;
   if(!categoryValues.includes(category)){
      category=null;
   }
   const filter=category?{category:category}:{};
   const allListings=  await Listing.find(filter);
    res.render("listings/index.ejs",{allListings,categories,activeCategory:category});

};

//adding new listing
module.exports.addNewListing=(req,res)=>{
    res.render("listings/new.ejs");
};

//show listing 
module.exports.showListings=async (req,res)=>
{ let {id}=req.params;
 const listing=await  Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
 if(!listing){
    req.flash("error","Listing does not exist");
  return  res.redirect("/listings");
 }
 res.render("listings/show.ejs",{listing});
};

//create new listing 
 module.exports.createListing=async (req,res)=>{
    // let{title,description,image,price ,country,location}=req.params;
  //using joi for server side schema validation 
  let url=req.file.parth;
  let filename=req.file.filename;
   const newListing= new Listing(req.body.listing);
   newListing.owner=req.user._id;
   newListing.category=randomCategories();
   newListing.image={url,filename};
   await newListing.save();
   req.flash("success","listing created");
   res.redirect("/listings");
};

//edit listing
module.exports.editListing=async (req,res)=>{
   let {id}=req.params;
 const listing=await  Listing.findById(id);
 if(!listing){
   req.flash("error","Listing does not exist");
  return  res.redirect("/listings");
 }
  
   res.render("listings/edit.ejs",{listing});
};


//update listing
module.exports.updateListing=async(req,res)=>{
   let{id}=req.params;
   await  Listing.findByIdAndUpdate(id,{...req.body.listing});
   if( typeof req.file!=="undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();}
   req.flash("success","listing Updated");
   res.redirect(`/listings/${id}`);
};

//delete listing

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","deleted");
   res.redirect("/listings");
};
