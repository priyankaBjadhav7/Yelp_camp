var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
	var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //GET ALL CAMPGROUNDS FORM DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // GET ALL CAMPGROUNDS FROM DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }
});
//NEW--ADD NEW CAMPGROUNDS

router.post("/",middleware.isLoggedIn,function(req,res){
	var name =req.body.name;
	var image=req.body.image;
	var cost = req.body.cost;
	var price=req.body.price;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground = {name: name, image: image, cost: cost, description: desc, author:author};
	
//CREATE NEW CAMPGROUND AND SAVE TO THE DB

Campground.create(newCampground, function(err,newlyCreated){
	if(err){
		console.log(err);
	}else{
		console.log(newlyCreated);
		res.redirect("/campgrounds");
	}

	});
});
//CREATE --NEW CAMPGROUNDS

router.get("/new", middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new");
});
//SHOW MORE INFO

router.get("/:id",function(req,res){
    //FIND CAMPGROUND WITH ID
    
	console.log(req.params.id);
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground)
			res.render("campgrounds/Show",{campground:foundCampground});
		}
	});
});
//EDIT CAMPGROUND ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
       res.render("campgrounds/edit",{campground:foundCampground});
	});
});
//UPDATE CAMPGROUND ROUTE

router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
//FIND AND UPDATE CURRENT CAMPGROUND
	var newData = {name: req.body.name, image: req.body.image, cost: req.body.cost, description: req.body.description};
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updateCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//DESTROY CAMPGROUND ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});
//LIKE CAMPGROUND

router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }
// CHECK IF REQUIRED USER IS EXISTS 
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });
         if (foundUserLike) {
            foundCampground.likes.pull(req.user._id);
        } else {
            foundCampground.likes.push(req.user);
        }
         foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });4
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
//MIDDLEWARE

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;


