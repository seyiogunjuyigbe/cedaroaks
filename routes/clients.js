const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');

//Dashboard Route
router.get("/profile/:id/dashboard", function(req,res){
    User.findById(req.user.id, function(err,user){ 
        if(err){
        console.log(err)
    }
        else{
           res.render("Clients/dashboard", {user:user}); 
        }
    })
    
   
})

//Payment Form
router.get("/profile/:id/payments/new", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            res.render("Clients/paymentForm", {user:user})
        }
   })
});

//New payment route
router.post("/profile/:id/payment/new", isLoggedIn, function(req,res){
    
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err)
        } else{
            // let payment = req.body.payments;
            // payment.date = new Date();
          let payment = {amount:req.body.amount, date: new Date()}
            user.payments.push(payment);
            user.payments.forEach(function(payment){
            if(user.balance == NaN || user.balance == undefined){
                user.balance = 0;
                user.balance += payment.amount;
            } else{
                user.balance += payment.amount;
            }
         })
            user.save();
            console.log(`${user.firstName} paid ${payment.amount} on ${payment.date}`)
            console.log(user)
        }
        res.redirect(`/user/profile/${user._id}`)
    });
});

//Show User profile and balance
router.get("/profile/:id", function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err)
        } else{
          res.render("Clients/profile", {User:user})
        }
    })
    
});

router.get("/profile/:id/loan-request", function(req,res){
    res.send("Loan request route")
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
           res.redirect("/user/login"); 
    }
    }

module.exports = router;