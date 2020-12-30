var mongoose=require("mongoose");

var campSchema= new mongoose.Schema({
	name:String,
	phnum:String,
	price:String,
	image:String,
	descp:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

var Camp=mongoose.model("camp",campSchema);

module.exports=mongoose.model("Camp",campSchema);