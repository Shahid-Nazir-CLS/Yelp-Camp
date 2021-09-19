const mongoose   = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	url: String,
	filename: String
})

ImageSchema.virtual('thumbnail').get(function (){
	return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: { virtuals: true}};

const campgroundSchema = new Schema({
	name: {
		type : String,
		required : true
	},
	geometry: {
		type: {
			type: String,
			enum: ['Point'], 
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},	
	price :{
		type : Number,
		min : 0
	},
	location : {
		type : String
	},
	images: [ImageSchema],
	description : {
		type : String,
		required : true
	},
	author:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
}, opts);

campgroundSchema.virtual('properties.popUpText').get(function (){
	return `<h3> <a href="/campgrounds/${this._id}"> ${this.name}</a> <h3> <br> ${this.location}`
})

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

