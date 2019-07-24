const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const methodOverride = require('method-override');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cedaroaks', {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    payments: [{
     amount: Number,
     date: String  
    }],
    balance: {type: Number, default: 0},
    category: String
})
let User = mongoose.model('User', userSchema);

// User.remove({}, function(err){
// if(err){
//     console.log(err)
// } else{
//     console.log('removed!')
// }
// })
app.get("/", function (req,res){
    res.render("new")
})
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
app.post("/pay/:id", function(req,res){
    let payment = req.body.payments;
    User.findById(req.params.id, function(err, thisUser){
        if(err){
            console.log(err)
        } else{
            thisUser.payments.push(payment);
            thisUser.save();
            console.log(`${thisUser.name} paid ${payment.amount} on ${payment.date}`)
        }
        res.redirect("/profile/"+thisUser._id)
    })
    

    
   
})

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

app.get("/all", function(req, res){
    User.find({}, function(err, allUsers){
        res.render("allUsers", {Users: allUsers})
    })
})


app.listen(8888, process.env.IP, function(){
    console.log("App Started!")
})