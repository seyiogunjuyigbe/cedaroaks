const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const methodOverride = require('method-override');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cedaroaks', {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


//Schema Set Up
//user schema setup
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
    username: String,
    password: String,
    payments: [{
     amount: Number,
     date: String  
    }],
    balance: {type: Number, default: 0},
    category: String
});
userSchema.plugin(passportLocalMongoose);
let User = mongoose.model('User', userSchema);

// User.remove({}, function(err){
// if(err){
//     console.log(err)
// } else{
//     console.log('removed!')
// }
// })



//PASSPORT CoNFIG
app.use(require("express-session")({
    secret: "cedar-secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES Setup


//User Routes
//New User
app.get("/", function (req,res){
    res.render("new")
})

//Create new user
app.post("/", function(req,res){
    let user = req.body.User;
    User.create(user, function(err, user){
        if(err){
            console.log(err)
        } else{
            console.log(`${user.name} added to DB`)
            res.redirect("/profile/"+user._id)
        }
    })
})

//New payment route
app.post("/pay/:id", function(req,res){
    let payment = req.body.payments;
    
    User.findById(req.params.id, function(err, thisUser){
        if(err){
            console.log(err)
        } else{
            payment.date = new Date();
            thisUser.payments.push(payment);
            thisUser.save();
            console.log(`${thisUser.firstName} paid ${payment.amount} on ${payment.date}`)
        }
        res.redirect("/profile/"+thisUser._id)
    })
    
    

    
   
})

//Show User profile and balance
app.get("/profile/:id", function(req,res){
    User.findById(req.params.id, function(err, thisUser){
        if(err){
            console.log(err)
        } else{
            let payments = thisUser.payments;
            let balance = thisUser.balance;
            balance = 0
            payments.forEach(function(payment){
                balance += payment.amount;
                thisUser.balance = balance;
            })
            res.render("profile", {User:thisUser})
        }
        // console.log(thisUser)
    })
    
})


//Show all users

app.get("/all", function(req, res){
    User.find({}, function(err, allUsers){
        res.render("allUsers", {Users: allUsers})
    })
})


//Auth Routes
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    let newUser = new User({username: req.body.username})
User.register(newUser, req.body.password, function(err,user){
    if(err){
        console.log(err);
        return res.render('register');
    } else{
        passport.authenticate("local")(req, res, function(){
            let user = req.body.user;
            
    User.create(user, function(err, user){
        if(err){
            console.log(err)
        } else{
            user.username = req.body.username;
            user.password = req.body.password;
            user.save();
            console.log(user)
            res.redirect("/profile/"+user._id)
        }
    })
        })
    }
})


})

app.listen(8888, process.env.IP, function(){
    console.log("App Started!")
})