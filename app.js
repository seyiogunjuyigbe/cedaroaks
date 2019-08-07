var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');
var flash = require("connect-flash");



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cedaroaks', {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(flash());

const User = require("./models/user");
const Admin = require("./models/admin");

function addAdmin(){
let newAdmin = new Admin({
    username: "admin", 
    firstName: "Seyi",
    lastName: "Ogunjuyigbe",
    phone: 08169606684,
    email: "seyiogunjuyigbe@gmail.com",
    category: "Admin"
});
let password = "admin"
  Admin.register({
    newAdmin, password, function(err,admin){
        if(err){
            console.log(err);
         }
            passport.authenticate("local")(req, res, function(){
                console.log(admin);
                res.redirect("/")
               })
        
}
});  
}
// addAdmin();



const purseSchema = new mongoose.Schema({
    totalAmount: Number,

});
let purse = function gatherPurse(users){
    User.find({}, function(err, users){
        let purseAmt = 0;
        var userPayments = users.map(function (user) {
            for (var i =0; i<users.length; i++){
               
               if(user.payments[i] !== undefined){
                   
                   purseAmt += user.payments[i].amount;
               }
                
            }
            
          });
    
          console.log(`Total balance: ${purseAmt}`);
    })
}
purse();


// app.get("/a", function(req,res){
//    User.find({}, function(err,all){
//     if(err){
//         console.log(err)
//     } else {
//         var allpays = [];
//         all.forEach(function(user){
//             allpays.push(user.payments)
//         })
//         res.send(allpays)
//     }
// }) 
// })




//PASSPORT CoNFIG
app.use(require("express-session")({
    secret: "cedar-secret",
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})



const clientRoutes = require("./routes/clients");
const adminRoutes = require("./routes/admin");
const clientAuthRoutes = require("./routes/index");

app.use("/user", clientAuthRoutes);
app.use("/user", clientRoutes);
app.use("/admin", adminRoutes);


app.get("/", isLoggedIn, function (req,res){
    res.render("index", {currentUser:req.user})
})

app.get("/all", isLoggedIn, function(req, res){
    User.find({}, function(err, allUsers){
        console.log("User: "+req.user);
        res.render("Admin/allUsers", {Users: allUsers, currentUser:req.user})
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
           res.redirect("/user/login"); 
    }
    }


function clearUsers(){
    User.remove({}, function(err,removed){
        if(err){
            console.log(err)
        } else{
            console.log("All Users wiped off!!!!")
        }
    })
}
// clearUsers();
app.listen(8888, process.env.IP, function(){
    console.log("App Started!")
})