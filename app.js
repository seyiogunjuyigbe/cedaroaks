var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');
var flash = require("connect-flash");
var request = require("request");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://newUser:yuwgt2jSmk6RYBLD@cluster0-qiypo.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(flash());


const User = require("./models/user");
const Admin = require("./models/admin");
const Payment = require("./models/payment")

//PASSPORT CoNFIG
app.use(require("express-session")({
    secret: "cedar-secret",
    resave: false,
    saveUninitialized: false, 
    expires: new Date(Date.now() + (30 * 86400 * 1000))
}));

passport.use("local", new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use("admin-local", new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

const clientRoutes = require("./routes/clients");
const adminRoutes = require("./routes/admin");
const clientAuthRoutes = require("./routes/userindex");
const clientPayRoutes = require("./routes/payments")
const adminAuthRoutes = require("./routes/adminindex");


app.use("/user", clientAuthRoutes);
app.use("/user", clientRoutes);
app.use("/user/profile/:id/contributions", clientPayRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminAuthRoutes);



app.get("/", function (req,res){
    res.render("index", {currentUser:req.user})
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
           res.redirect("/user/login"); 
    }
    }

app.get("*", function(req,res){
    res.render("Error");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("App Started!")
})
