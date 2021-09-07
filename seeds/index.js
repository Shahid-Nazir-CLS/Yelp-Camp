const mongoose   = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places, images } = require("./seedHelpers");

mongoose.connect("mongodb://localhost/yelp_camp")
.then(() => {console.log("Mongoose Connection Open")})
.catch(err => {console.log(err);});


const seedDB = async () => {
    await Campground.deleteMany({});

    for(let i = 0; i < 50; i++){

        const rndName = Math.floor(Math.random() * places.length) + 0;
        const rndPrice = Math.floor(Math.random() * 50) + 10;
        const rndLocation = Math.floor(Math.random() * 1000) + 0;
        const rndImage = Math.floor(Math.random() * images.length) + 0;

        const ground =  new Campground({			// instantiate a new Cat or Document
            name : `${descriptors[rndName]} ${places[rndName]}`,
		    price : `${rndPrice}`,
		    location : `${cities[rndLocation].city}, ${cities[rndLocation].state} `,
		    image : `${images[rndImage]}`,
		    description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." 
        });

        await ground.save();
    }

    console.log("Seed Data saved to DB");
}

seedDB();