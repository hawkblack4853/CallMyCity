var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");

//schema 
var providerSchema = new mongoose.Schema({
	name: String,
	city: String,
	age : Number,
	work: String,
	contact: Number
});

var Provider = mongoose.model("Provider", providerSchema);

// Provider.create(
//	{
//		name: "pushkar", 
//		city: "pratapgarh", 
//		age: "19", 
//		work: "electrician"
//	}, function(err, provider){
//		if(err){
//			console.log(err);
//		} else{
//			console.log("created a new profile!");
//			console.log(provider);
//		}
//	})

//db

mongoose.connect("mongodb://localhost/call_my_city");
var customer = [
		{name: "abhinav", city: "rishikesh", age: "19", work: "electrician"},
		{name: "pushkar", city: "pratapgarh", age: "19", work: "car mechanic"},
		{name: "sanyam", city: "faridabad", age: "20", work: "plumber"},
		{name: "shivansh", city: "mirzapur", age: "19", work: "carpenter"}
	]


//===================================
//   ROUTES      
//===================================

app.get("/", function(req, res){
	res.render("landing.ejs");
})

app.get("/customer", function(req, res){
	Provider.find({}, function(err, allProvider){
		if(err){
			console.log(err);
		} else{
			res.render("customer",{customer: allProvider});		
		}
	})
})

app.get("/provider", function(req, res){
	res.render("provider");
})

app.post("/customer", function(req, res){
	var name = req.body.name;
	var city = req.body.city;
	var age = req.body.age;
	var work = req.body.work;
	var contact = req.body.contact;
	
	var newProvider = {name: name, city: city, age: age, work: work, contact: contact}
	//create and save to the database
	Provider.create(newProvider, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			//redirect
			res.redirect("/customer");		
		}
	})
	
})


//server call=======================================

app.listen(process.env.PORT || 3000, function(){
     console.log("congo Server has started!!");
});
