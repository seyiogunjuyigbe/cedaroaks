var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Admin = require("../models/admin");
var User = require("../models/user");
var Purse = require("../models/purse");
 

function gatherPurse(){
    Purse.findById('5d4d4171d620241cb803eda0', function(err,purse){
      if(err){
          console.log(err)
      } else{
          User.find({}, function(err, users){
              users.forEach(function(user){
              if(user.balance !== undefined && user.balance !== NaN){
              purse.balance += user.balance
              }
              })
           console.log(`Total balance: ${purse.balance}`);  
            }) 
      }
      // purse.save();
      // console.log(purse)
  })
 
};

//Registration form
router.get("/register", function(req,res){
    res.render("Admin/register");
});

//Register new Admin
router.post("/register", function(req,res){
   
    let newAdmin = new Admin({
        username: req.body.username, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        category: "Admin"
    })
Admin.register(newAdmin, req.body.password, function(err,admin){
    if(err){
        console.log(err);
        return res.render('Admin/register');
    }
        passport.authenticate("admin-local")(req, res, function(){
            console.log(admin);
            res.redirect("/admin")
           })
    
})
})

//login route
router.get("/login", function(req,res){
    res.render("Admin/login");
})

router.post("/login", passport.authenticate("admin-local", {
       failureRedirect: "/admin/login"
}), function(req,res){
    // console.log(req.user);
    res.redirect("/admin");
    // Admin.find({}, function(err,admins){
    //     if(err){
    //         console.log(err)
    //     } else{
    //        User.find({}, function(err, users){
    //     if(err){
    //         console.log(err)
    //     } else{
    // return res.render("Admin/dashboard", {admin:req.user,Users:users,admins:admins})
    //     }
    // }) 
    //     }
    // })  
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