//categories -->shared by model, seed data & filter bar
const categories=[
    {value:"trending",label:"Trending",icon:"fa-solid fa-fire"},
    {value:"rooms",label:"Rooms",icon:"fa-solid fa-bed"},
    {value:"hillstation",label:"Hillstation",icon:"fa-solid fa-mountain-city"},
    {value:"castle",label:"Castle",icon:"fa-brands fa-fort-awesome"},
    {value:"pool",label:"Pool",icon:"fa-solid fa-water-ladder"},
    {value:"camping",label:"Camping",icon:"fa-solid fa-tent"},
    {value:"farms",label:"Farms",icon:"fa-solid fa-tractor"},
    {value:"pets",label:"Pets",icon:"fa-solid fa-paw"},
    {value:"nature",label:"Nature",icon:"fa-solid fa-tree"},
    {value:"sunset",label:"Sun Set",icon:"fa-solid fa-mountain-sun"},
    {value:"riverview",label:"River View",icon:"fa-solid fa-water"},
    {value:"fungames",label:"Fun Games",icon:"fa-solid fa-gamepad"},
];

const categoryValues=categories.map((c)=>c.value);

//random 1-3 unique categories for a listing
const randomCategories=()=>{
    const count=Math.floor(Math.random()*3)+1;
    const shuffled=[...categoryValues].sort(()=>Math.random()-0.5);
    return shuffled.slice(0,count);
};

module.exports={categories,categoryValues,randomCategories};
