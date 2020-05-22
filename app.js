var express 	= require("express");
 	app 		= express(),
 	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash		= require("connect-flash"),
	passport	=require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	Campground 	=require("./models/campgrounds"),
	Comment		=require("./models/comment"),
	User=require("./models/user"),
	app.locals.moment = require('moment'),

 commentRoutes=require("./routes/comments")	;
 campgroundRoutes=require("./routes/campgrounds");
 indexRoutes=require("./routes/index");
	

mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://localhost/fuzzy_search");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"once again welcome",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.get("/",function(req,res){
	res.render("landing");
});


//SCHEMA SETUP



var campgrounds= [
	{name:"samta",image:"https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"shreya",image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"shubhe",image:"https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"kalli",image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"kalli",image:"https://images.unsplash.com/photo-1542332213-1d277bf3d6c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"kalli",image:"https://images.unsplash.com/photo-1558123567-01c8e1aca56f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"kalli",image:"https://images.unsplash.com/photo-1513104399965-f5160d963d39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"kalli",image:"https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60.jpg"},
	{name:"kalli",image:"https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60.jpg"},
]



var server = app.listen(3000,function(){
	console.log("server connected");

});