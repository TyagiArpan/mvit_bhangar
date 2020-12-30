var Camp=require("../models/camp");
var Comment=require("../models/comment");
var middlewareObj={};

middlewareObj.check=function(req,res,next){
	if(req.isAuthenticated()){
		Camp.findById(req.params.id,function(err,foundCamp){
			if(err){
				res.redirect("back");
			}else{
				if(foundCamp.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error","permission denied!!")
					res.redirect("back");	
				}
			}
	    });
	}else{
		req.flash("error","You need to be logged in to do that!!")
		res.redirect("back");
	}
}
	

middlewareObj.check1=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error","permission denied!!")
					res.redirect("back");	
				}
			}
	    });
	}else{
		req.flash("error","You need to be logged in to do that!!")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
	   return next();
	};
	req.flash("error","You need to be logged-in to do that!!")
	res.redirect("/login");
};
	
module.exports=middlewareObj;