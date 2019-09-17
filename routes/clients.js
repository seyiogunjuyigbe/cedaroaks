const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const request = require("request");
 
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
            User.find({}, function(err, all){
                if (err) {
                    console.log(errr)
                } else {
                    var users = [];
                    all.forEach(x => {
                        users.push(x.username)
                    });
            res.render("Clients/loanRequest", {User:user, users:users})
            
                }
            })
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
           user.loanRequests.push(loanRequest);   
                        user.save();
                        var loan = loanRequest;
                        function reqObj(){
                            var requestObj = {
                                loan_id: loan._id,
                                amount: amount,
                                dateApplied: date,
                                duration: loan.duration,
                                paybackAmount: 0,
                                rate: loan.rate,
                                dueDate: "",
                                requestorID: user._id,
                                requestorUsername: user.username
                            };
                            console.log(loan);
                            var gua1 = loan.guarantor1;
                            var gua2 = loan.guarantor1;
                            User.findOne({username: gua1}, function(gua1){
                                // gua1.guarantorRequests.push(requestObj);
                                // gua1.save();
                                console.log(gua1);
                                });
                    User.findOne({username: gua2}, function(gua2){
                        // gua2.guarantorRequests.push(requestObj);
                        // gua2.save();
                        console.log(gua2);
                                })
                        }
      reqObj();
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

//Loan Payment Route
router.get("/profile/:id/loan-request/:loan_id/status", isLoggedIn, function(req,res){
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            let found;
            user.loanRequests.forEach(function(x){
                if(x._id == req.params.loan_id){
                    found = x;
                }
                               
            })
            // res.send(found);
            res.render("Clients/loanPayment", {loan:found})
        }
    })

})

// Enter Guarantor code route
router.get("/profile/:id/guarantor-requests", isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            res.render("Clients/guarantorRequest", {User:user})
        }
    })
})

//Generate one time code for another user
router.get("/profile/:id/guarantor-requests/:request_id/approve", isLoggedIn, function(req,res){
   var found; 
   var x;
   User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            
            user.guarantorRequests.forEach(foundRequest => {
                if(foundRequest._id == req.params.request_id){
                    found = foundRequest._id;
                    var reqIDClip = String(found).slice(0,10);
                    let userIDClip = String(user._id).slice(11,24);
                    const approvalID = reqIDClip + userIDClip;
                    // console.log(approvalID);
                    foundRequest.approvalStatus = true;
                    foundRequest.approvalID= approvalID;
                    x = foundRequest;
                } 
                
                })
                user.save();
              
            } 
           console.log("X: " + x)
User.findById(x.requestorId, function(err, foundUser){
    if (err) {
        console.log(err)
    } else {
        res.send(foundUser);
        console.log(user);
    }
})
                  // res.render("Clients/guarantorRequest", {User:user})
    });
                


    
        //     let smsRecipient = foundUser.phone;
        //     let smsToken = "VZtzrPbfChTUCmMl38xfZTntVolPff0JQBuhFOJvStSYNbol6GX2dID1pZgao4ocsH0AUk3I3XwuhU2h5v08V5odLdfN6UodIO2P";
        //     let message = "Dear " + foundUser.firstName + ", please use this token for approval: "+approvalID;

        // request("https://smartsmssolutions.com/api/json.php?&sender= Cedar Oaks" + "&to=" + smsRecipient + "&message=" + message +"&routing=2"+ "&type=0&token="+ smsToken, function(error, response, body){
        //     if(error){
        //         console.log(error);
        //     } else if(!error && response.statusCode == 200){  

        //     }                    
        // });                   
        //    var found;
        //    foundUser.loanRequests.forEach(x => {
            //    if (x._id == )
        //    });
            // if(foundUser.guarantor1ID == user._id){
            // foundUser.guarantor1Code = approvalID;
            // foundUser.guarantor1Status=true;
            // console.log("Guarantor 1 found");
            
        // } 
        // else if(foundUser.guarantor2ID == user._id){
            // foundUser.guarantor2Code = approvalID;
            // foundUser.guarantor2Status=true;
            // console.log("Guarantor 2 found");
        // }
        
//         foundUser.save();
// })

})
//Pay back loan


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
           res.redirect("/user/login"); 
    }
    }

module.exports = router;