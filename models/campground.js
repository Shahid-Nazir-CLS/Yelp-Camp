const mongoose   = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
	name: {
		type : String,
		required : true
	},
	price :{
		type : Number,
		min : 0
	},
	location : {
		type : String
	},
	image: {
		type : String,
		required : true
	},
	description : {
		type : String,
		required : true
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

campgroundSchema.post('findOneAndDelete', async (campground) => {
    if(campground.reviews.length > 0){
        await Review.remove({
			_id: {
					$in: campground.reviews
				}
			});
    }
    console.log("Campground and all its reviews deleted");
})


const Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;

