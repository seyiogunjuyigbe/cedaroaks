var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var User = require("../models/user");


//Auth Routes
//Registration form
router.get("/register", function(req,res){
    res.render("Clients/register");
});

//Register new user
router.post("/register", function(req,res){
    // res.send(req);
    let newUser = new User({
        username: req.body.username, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        category: "Client"
    })
User.register(newUser, req.body.password, function(err,user){
    if(err){
        console.log(err);
        return res.render('Clients/register');
    }
        passport.authenticate("local")(req, res, function(){
            console.log(user);
            res.redirect("/user/dashboard")
           })
    
})
})

//login route
router.get("/login", function(req,res){
    res.render("Clients/login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect:'/',
    failureRedirect: "/user/login"
}), function(req,res){
    // res.redirect("/all")
})


//logout route
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/user/login")
})

function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
    return next();
}
res.redirect("/user/login");
}

module.exports = router;