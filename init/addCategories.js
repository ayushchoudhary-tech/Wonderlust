//gives random categories to existing listings that have none (keeps all other data)
const mongoose=require("mongoose");
const Listing=require("../models/listings.js");
const {randomCategories}=require("../utils/categories.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

async function main()
{
    await mongoose.connect(MONGO_URL);
    const listings=await Listing.find({$or:[{category:{$exists:false}},{category:{$size:0}}]});
    for(let listing of listings){
        listing.category=randomCategories();
        await listing.save();
        console.log(`${listing.title} -> ${listing.category.join(", ")}`);
    }
    console.log(`updated ${listings.length} listings`);
}

main()
.catch((err)=>{
    console.log(err);
})
.finally(()=>mongoose.disconnect());
