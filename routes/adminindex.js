var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Admin = require("../models/admin");

//Registration form
router.get("/register", function(req,res){
    res.render("Admin/register");
});

//Register new Admin
// router.post("/register", function(req,res){
   
//     let newAdmin = new Admin({
//         username: req.body.username, 
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         phone: req.body.phone,
//         email: req.body.email,
//         category: "Admin"
//     })
// Admin.register(newAdmin, req.body.password, function(err,admin){
//     if(err){
//         console.log(err);
//         return res.render('Admin/register');
//     }
//         passport.authenticate("local")(req, res, function(){
//             console.log(admin);
//             res.redirect("/")
//            })
    
// })
// })

//login route
router.get("/login", function(req,res){
    res.render("Admin/login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect:"/admin/dashboard",
    failureRedirect: "/admin/login"
}), function(req,res){
    // res.redirect("/all")
})


//logout route
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/admin/login")
})

function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
    return next();
}
res.redirect("/admin/login");
}

module.exports = router;