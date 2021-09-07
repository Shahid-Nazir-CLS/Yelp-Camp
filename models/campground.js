const mongoose   = require("mongoose");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
	name: {
		type : String,
		required : true
	},
	price :{
		type : String,
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
	}
});

const Campground = mongoose.model("Campground", campgroundSchema);


module.exports = Campground;

