var express=require("express");
var router=express.Router({mergeParams:true});
var Camp=require("../models/camp");
var Comment=require("../models/comment");
var middleware=require("../middleware");


//new comment
router.get("/new",middleware.isLoggedIn,function(req,res){
	Camp.findById(req.params.id,function(err,camp){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{camp:camp});
		}
	});
});


//create comment
router.post("/",middleware.isLoggedIn,function(req,res){
	Camp.findById(req.params.id,function(err,camp){
		if(err){
			console.log(err);
			res.redirect("/camp");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					camp.comments.push(comment);
					camp.save();
					res.redirect("/camp/" + camp._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit",middleware.check1,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{camp_id:req.params.id,comment:foundComment});
		}
	});
});

router.put("/:comment_id",middleware.check1,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/camp/"+req.params.id)
		}
	})
});


router.delete("/:comment_id",middleware.check1,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/camp/"+req.params.id);
		}
	});
});


module.exports=router;