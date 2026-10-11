const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listings.js");
const {randomCategories}=require("../utils/categories.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";


main()
.then(()=>{
    console.log("connected to db");
    initDB();
})
.catch((err)=>{
    console.log(err);
});
async function main()
{
    await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
    await Listing.deleteMany({}); 
   initData.data= initData.data.map((obj)=>({...obj,owner:"6a9b06d635871ccef2207a77",category:randomCategories()}));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
};

