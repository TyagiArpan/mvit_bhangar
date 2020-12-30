var express=require("express");
var multer=require("multer");
var	path =require("path");
var router=express.Router({mergeParams:true});
var Camp=require("../models/camp");
var middleware=require("../middleware");

var Storage=multer.diskStorage({
	destination:"./public/stylesheets/uploads/",
	filename:(req,file,cb)=>{
		cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
	}
});

var upload=multer({
	storage:Storage
}).single("image");

var upload1=multer({
	storage:Storage
}).single("camp[image]");

//INDEX - show all campground
router.get("/",function(req,res){
	Camp.find({},function(err,allCamp){
		if(err){
			console.log("err");
		}else{
			res.render("camps/index",{camp:allCamp});
		}
	});
});


//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("camps/new");
});


//CREATE - create a new campground
router.post("/",upload,middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var phnum=req.body.phnum;
	var price=req.body.price;
	var image=req.file.filename;
	var descp=req.body.descp;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newcamp={name:name,phnum:phnum,price:price,image:image,descp:descp,author:author};
	Camp.create(newcamp,function(err,newlycreated){
		if(err){
			console.log("err");
		}else{
			res.redirect("/camp");
		}
	});
});


//SHOW - show info abt products
router.get("/:id",upload1,function(req,res){
	Camp.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err){
		console.log(err);
		}else{
		res.render("camps/show",{camp:foundCamp});
		} 
	});
});



router.get("/:id/edit",middleware.check,function(req,res){
		Camp.findById(req.params.id,function(err,foundCamp){
			res.render("camps/edit",{camp:foundCamp});
		});
});

//EDIT - edit any product
router.post("/:id",upload1,middleware.check,function(req,res){
	
	if(req.file){
		var updcamp={ 
			name:req.body.name,
	 		phnum:req.body.phnum,
	 		price:req.body.price,
	 		image:req.file.filename,
	 		descp:req.body.descp,
	 		author:{
				id:req.user._id,
				username:req.user.username
			},
		};
	}else{
		var updcamp={ 
			name:req.body.name,
			phnum:req.body.phnum,
			price:req.body.price,
			descp:req.body.descp,
			author:{
				id:req.user._id,
				username:req.user.username
			},
		};
	}
	Camp.findByIdAndUpdate(req.params.id,updcamp,function(err,updatedCamp){
		if(err){
			console.log("err");
		}else{
			res.redirect("/camp/"+req.params.id);
		}
	});
});

	
router.delete("/:id",middleware.check,function(req,res){
	Camp.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/camp");
		}else{
			res.redirect("/camp");
		}
	});
});


module.exports=router;