const express = require('express');
const router = express.Router({mergeParams: true});
const Admin = require('../models/admin');
const User = require('../models/user');
const Purse = require("../models/purse")
// const mongoose = require("mongoose");
router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

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
// gatherPurse();


//Dashboard Route
router.get("/dashboard", isLoggedInAdmin, function(req,res){
    Admin.findById(req.user.id, function(err, found){
    Admin.find({}, function(err,admins){
        if(err){
            console.log(err)
        } else{
           User.find({}, function(err, users){
        if(err){
            console.log(err)
        } else{
            // console.log(users)
             res.render("Admin/dashboard",{Users:users, admin:found, purse:gatherPurse, admins:admins})

        }
    }) 
        }
    })     
})
    
})

//New payment route
router.post("/pay/:id", function(req,res){
    let payment = req.body.payments;
    
    Admin.findById(req.params.id, function(err, thisAdmin){
        if(err){
            console.log(err)
        } else{
            payment.date = new Date();
            thisAdmin.payments.push(payment);
            thisAdmin.save();
            console.log(`${thisAdmin.firstName} paid ${payment.amount} on ${payment.date}`)
            // console.log(thisAdmin)
        }
        res.redirect("/Admin/profile/"+thisAdmin._id)
    });
});

//Show Admin profile and balance
router.get("/profile/:id", function(req,res){
    console.log(req.params);
    Admin.findById(req.params.id, function(err, thisAdmin){
        if(err){
            console.log(err)
        } else{
            console.log(thisAdmin)
             }            
            res.render("Admin/profile", {Admin:thisAdmin})
        // console.log(thisAdmin)
    })
});

router.get("/payloan/:id", function(req,res){
    User.findById(req.params.id, function(err,user){
        if(user.balance == NaN || user.balance == undefined){
            user.balance = 0;
            user.balance += 1000;
            user.save();
        } else{
           user.balance += 1000; 
           user.save();
        }
       res.redirect("back")
    

    })
})

function isLoggedInAdmin(req,res,next){
if(req.isAuthenticated() && req.user.category == "Admin"){
    return next();
} else if(req.user.category !== "Admin"){
    res.render("error")
} else{
    res.redirect("/admin/login");
}

}


module.exports = router;