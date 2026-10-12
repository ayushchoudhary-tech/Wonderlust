require("dotenv").config({path:require("path").join(__dirname,"../.env")});
const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listings.js");
const User=require("../models/user.js");
const {randomCategories}=require("../utils/categories.js");
const MONGO_URL=process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("connected to db");
    return initDB();
})
.catch((err)=>{
    console.log(err);
})
.finally(()=>mongoose.disconnect());
async function main()
{
    await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
    //only seed an empty db so real listings are never touched
    const count=await Listing.countDocuments();
    if(count>0){
        console.log(`db already has ${count} listings - skipping seed`);
        return;
    }
    //owner must be a user that exists in this database
    const owner=await User.findOne();
    if(!owner){
        throw new Error("No user found in db - sign up on the site first, then run this script");
    }
   initData.data= initData.data.map((obj)=>({...obj,owner:owner._id,category:randomCategories()}));
    await Listing.insertMany(initData.data);
    console.log(`data was initilized with owner ${owner.username}`);
};
