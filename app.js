var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
// var multer      = require("multer");
var LocalStrategy = require("passport-local");
var User          = require("./models/user");

// var mongoURI = "mongodb+srv://mrhashcoder:mansi8101@node.zafk9.mongodb.net/hackathon?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");

//multer- image upload

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
 
// var upload = multer({ storage: storage }).single('file');
 

//schema 
var providerSchema = new mongoose.Schema({
	name: String,
	gender: String,
	city: String,
	age : Number,
	work: String,
	contact: Number,
	// salary: Number,
	// image: String,
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

mongoose.connect("mongodb://localhost/call_my_city" , {
	useCreateIndex : true,
	useNewUrlParser:true,
	useUnifiedTopology:true,
});
var customer = [
		{name: "abhinav", city: "rishikesh", age: "19", work: "electrician"},
		{name: "pushkar", city: "pratapgarh", age: "19", work: "car mechanic"},
		{name: "sanyam", city: "faridabad", age: "20", work: "plumber"},
		{name: "shivansh", city: "mirzapur", age: "19", work: "carpenter"}
	]


//Passport configuration (authentication
app.use(require("express-session")({
	secret: "Hey! from pv!",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//===================================
//   ROUTES      
//==================================


app.get("/", function(req, res){
	res.render("landing");
})

function shuffle(arra1) {
    let ctr = arra1.length;
    let temp;
    let index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

app.get("/customer", async function(req, res){
	Provider.find({}, function(err, allProvider){
		if(err){
			console.log(err);
		} else{
			res.render("customer",{customer: shuffle(allProvider)});		
		}
	})
})

app.get("/customerByKeyword" , (req , res) => {
	try{
		var workPar = req.query.workPar;
		// console.log(workPar)
		var locPar = req.query.locPar;
		// console.log("yea");
		Provider.find({$or : [{city : locPar} , {work : workPar}]}, function(err, allProvider){
			if(err){
				console.log(err);
			} else{
				res.render("customer",{customer: allProvider});		
			}
		})
	}catch(err){
		console.log("error aa gya");
		res.render("error.ejs");
	}
})


app.post("/customer", function(req, res){
	var name = req.body.name;
	var city = req.body.city;
	var age = req.body.age;
	var work = req.body.work;
	var contact = req.body.contact;
	// var gender = req.body.gender;
	// var salary = req.body.salary;
	
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


app.get("/provider", isLoggedIn , function(req, res){
	res.render("provider");
})

///authntication routes
app.get("/register", function(req,res){
	res.render("register");
})

app.post("/register", function(req, res){
	var newUser  = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, User){
		if(err){
			console.log(err);
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/provider");
		});
		
	})
})

//login
app.get("/login", function(req, res){
	res.render("login");
})
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/provider",
		failureRedirect: "/login"
	}), function(req,res){
});
//logout
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/customer");
})

//logic
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


//server call=======================================

app.listen(process.env.PORT || 5000, function(){
     console.log("congo Server has started!!");
});


// http://localhost:3000/customerByKeyword?locPar=sikar&workPar=sex