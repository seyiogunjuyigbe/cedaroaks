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

//Contribution Form
router.get("/profile/:id/contrib/new", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            res.render("Clients/contributionForm", {user:user})
        }
   })
});

//New payment route
router.post("/profile/:id/contrib/new", isLoggedIn, function(req,res){
    
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err)
        } else{
            // let payment = req.body.payments;
            let date = new Date();
            let payment = {amount:req.body.amount, date: date.toDateString()}
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
//Loan request route
router.get("/profile/:id/loan-request/new", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            res.render("Clients/loanRequest", {User:user})
        }
    })
    
})

router.post("/profile/:id/loan-request/new", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
           var loanRequest = req.body.loanRequest;
           var date = new Date().toDateString();
           var amount = loanRequest.paybackAmount;
           loanRequest.dateApplied = date;
           
           var requestObj = {
                requestorId: user._id,
                requestorUsername:user.username,
                requestAmount: loanRequest.amount,
                requestDate: date,
                requestDueDate: "",
                requestPaybackAmount: loanRequest.paybackAmount
        };
           User.findOne({username: loanRequest.guarantor1}, function(err,guarantor1){
                if(err){
                    console.log(err)
                } else{
                        loanRequest.guarantor1ID = guarantor1._id;
                        loanRequest.guarantor1Username = guarantor1.username;
                        guarantor1.guarantorRequests.push(requestObj);
                        guarantor1.save();
                        // console.log(guarantor1);

                }
            User.findOne({username:loanRequest.guarantor2}, function(err,guarantor2){
                if(err){
                    console.log(err)
                } else{
                    loanRequest.guarantor2ID = guarantor2._id;
                    loanRequest.guarantor2Username = guarantor2.username;
                    guarantor2.guarantorRequests.push(requestObj);
                    guarantor2.save();
                    // console.log(guarantor2);
                }
                user.loanRequests.push(loanRequest); 
                user.save();
            });
         });
        }
        res.redirect(`/user/profile/${user._id}/loan-request/status`);
    })
    
})
//Loan Status Route
router.get("/profile/:id/loan-request/status", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            res.render("Clients/loanStatus", {User:user})
        }
    })
    
})

// Enter Guarantor code route
router.get("/profile/:id/guarantor-requests", isLoggedIn, function(req,res){
    User.findById(req.params.id, isLoggedIn, function(err,user){
        if(err){
            console.log(err)
        } else{
            res.render("Clients/guarantorRequest", {user:user})
        }
    })
})
//Generate one time code for another user

//Pay back loan


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
           res.redirect("/user/login"); 
    }
    }

module.exports = router;