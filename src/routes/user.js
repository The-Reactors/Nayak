const express = require('express')
const User = require('../models/user')
const multer = require('multer')

const auth = require('../middleware/auth')
const passport = require("passport")
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const router = new express.Router()



const profilePic = multer({
  limits:{
      fileSize:3000000
  },
  fileFilter(req,file,cb){
      if(!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
          return cb(new Error('This is not a correct format of the file'))

      cb(undefined,true)
  }
})


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ email: username }, (err, user) => {
      if (err)  {return done(err);}
      if (!user) return done(null, false,{ message: 'Incorrect username.' });
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }
));


passport.serializeUser((obj, done) => {
    done(null, obj);
  });
  
  // * Passport deserializeUser
  passport.deserializeUser(async (obj, done) => {
    done(null, obj);
  });


router.post("/updateProfilePic", auth, profilePic.single("profilePic"), async (req,res) =>{

  try{
    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
    user.profilePic = req.file.buffer
    await user.save()
    
    res.send(user)
  }catch(e){
    res.status(401).send(e)
  }
})


router.post("/notifyUser", auth, async (req, res) => {
  try{
  
    const user = await User.findOne({_id:req.body.creatorId})
  
    user.notificationList = user.notificationList.concat(
      {notifierName : req.body.notifierName,
       problemTitle : req.body.problemTitle,
       action: req.body.action})

    await user.save()
    res.send(user)

  }catch(e){
    console.log(e)
    res.status(400).send(e)
  }
})

router.post("/updateUserName", auth, async (req,res) =>{

  try{
    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
    user.name = req.body.name
    await user.save()
    
    res.send(user)

  }catch(e){
    res.status(401).send(e)
  }
})

router.post("/updateUserPhoneNo", auth, async (req,res) =>{

  try{
    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
    user.phoneNo = req.body.phoneNo
    await user.save()
    
    res.send(user)

  }catch(e){
    res.status(401).send(e)
  }
})

router.get("/getNotifications", auth, async (req,res) =>{

  try{
    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
    res.status(200).send(user.notificationList)

  }catch(e){
    res.status(401).send(e)
  }
})
router.get(
    "/login/google",
    passport.authenticate("google", {scope:["profile","email" ] })
);
router.get(
    "/auth/login/callback", (req, res, next) => {
    passport.authenticate(
        "google", {
            scope: ["profile", "email"],
        },
        function(err, user, info) {
         
            if (!user)
                return res.redirect(
                    `${process.env.CLIENT_URL}/error?err=${info?.message}`
                );
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
            
                return res.redirect(`${process.env.CLIENT_URL}/`);
            });
        }
    )(req, res, next);

});

router.post("/localusers/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.status(400).send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          if(req.user)
          {
            res.status(200).send("Successfully Authenticated");
          }
          else
          { 
            res.status(400).send("Incorrect Password");
          }
        });
      }
    })(req, res, next);
  });

router.post('/users', async (req,res) =>{
    const user = new User(req.body)

    try{
        await user.save()
        //const token = await user.generateAuthToken()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }

})

router.get('/users', auth, async (req, res) => {
  
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/ticket/markAsRead', auth, async (req, res) => {
  try{
    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
    user.notificationList=[]
    await user.save() 
    res.send(user)
  } 
  catch(e){
      res.status(401).send(e)
  }
})


router.get('/users/me', auth, async (req, res) => {
  try{  
    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
    res.send(user)
  }
  catch(e)
  {
    res.status(401).send(e)
  }
})
router.get('/users/logout', auth, async (req, res) => {
  req.logout();
  res.redirect(`${process.env.CLIENT_URL}/`);
})

module.exports = router