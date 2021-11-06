const express = require('express')
const multer = require('multer')
const Problem = require('../models/problem')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = new express.Router()

const problemImage = multer({
    limits:{
        fileSize:3000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
            return cb(new Error('This is not a correct format of the file'))

        cb(undefined,true)
    }
})

function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  router.get('/MyTickets',auth, async (req, res) => {
    try{
        const problems = await Problem.find({creatorId:req.user.id == undefined ? req.user._id : req.user.id})
        res.send(problems)
    }catch(e){
        res.status(400).send()
    }
})  

router.post('/updateStatus',auth, async (req,res) =>{
    try{
        
        const problem = await Problem.findOne({_id:req.body.problemId})
        problem.status = "Solved"
        await problem.save()
        res.status(200).send()
    }catch(e){
        res.status(400).send()
    }
})

router.get('/problemStatus/:problemId', async (req, res) => {
    try{
        
    const {problemId} = req.params
    const problem = await Problem.findOne({_id:problemId})
    res.status(200).send(problem.status)
    }catch(e){
        res.status(400).send()
    }
})  

router.get('/noOfUpAndDownVotes/:problemId', async (req, res) => {
    try{
     
    const {problemId} = req.params
    const problem = await Problem.findOne({_id:problemId})
    res.status(200).send([problem.upvotes,problem.downvotes])
    }catch(e){
        res.status(400).send()
    }
}) 

router.get('/statusOfUpAndDownVotes/:problemId', async (req, res) => {
    let problemId=req.params
    let isUpvoted = false
    let isDownvoted = false
    try
    {
        if(req.user)
        { 

            const latestUser=await User.findOne({_id: req.user.id == undefined ? req.user._id : req.user.id})
            const upVoteList= await latestUser.upvoteProblemsList
            const downVoteList=await latestUser.downvoteProblemsList
            if(upVoteList.indexOf(problemId.problemId) !== -1)
            {
               
                isUpvoted=true
            }
            if(downVoteList.indexOf(problemId.problemId) !== -1)
            {
               

                isDownvoted=true
            }
        }
        res.status(200).send([isUpvoted,isDownvoted])
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
})


router.get('/getStatus/:problemId', async (req, res) => {
    let problemId=req.params.problemId

    try
    {
        const problem = await Problem.findOne({_id:problemId})
       
        res.status(200).send({status:problem.status})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
})






router.get('/fetchProblems/:lat/:lng/:proximity/:category/:priority/:status', async (req, res) => {
  
    const lat = req.params.lat
    const lng = req.params.lng
    const proximity = req.params.proximity
    const category = req.params.category
    const priority = req.params.priority
    const status = req.params.status
    // const filter = req.params.filter
 
    let clusterOne = []
    let clusterTwo = []
    let clusterThree = []
    

    try{
        let filteredProblems = []

        const initialProblems = await Problem.find({})
       


        let problems = []

        for(let i = 0; i < initialProblems.length; i++){
            let flag = false
           
            if(category !== "none" && initialProblems[i].category !== category){
                flag =true
            }
            if(priority !== "none" && initialProblems[i].priority !== priority){
                flag =true
            }
            if(status !== "none" && initialProblems[i].status !== status){
                flag =true   
            }
            if(status === "none" && initialProblems[i].status === "Solved"){
                flag =true 
            }

            if(flag === false){
               problems.push(initialProblems[i])
            }
        }

      
        for(let i = 0; i < problems.length; i++){
            
        }
        

        

        for(let i = 0; i < problems.length; i++){

            // console.log("Distance From Location",getDistanceFromLatLonInKm(lat,lng,problems[i].latitude,problems[i].longitude))
            

            if(getDistanceFromLatLonInKm(lat,lng,problems[i].latitude,problems[i].longitude) < (proximity/3)){
                
                clusterOne.push(problems[i])
                
            }

            if(getDistanceFromLatLonInKm(lat,lng,problems[i].latitude,problems[i].longitude) < ((2*proximity)/3) && getDistanceFromLatLonInKm(lat,lng,problems[i].latitude,problems[i].longitude) > (proximity/3) ){
                
                clusterTwo.push(problems[i])
            }

            if(getDistanceFromLatLonInKm(lat,lng,problems[i].latitude,problems[i].longitude) < (proximity) && getDistanceFromLatLonInKm(lat,lng,problems[i].latitude,problems[i].longitude) > (2*(proximity)/3) ){
                
                clusterThree.push(problems[i])
            }
        }

        
        clusterOne.sort(function(a, b){return b.upvotes - a.upvotes})
        clusterTwo.sort(function(a, b){return b.upvotes - a.upvotes})
        clusterThree.sort(function(a, b){return b.upvotes - a.upvotes})


        for(let i = 0; i < clusterOne.length; i++){
            filteredProblems.push(clusterOne[i])
        }
        for(let i = 0; i < clusterTwo.length; i++){
            filteredProblems.push(clusterTwo[i])
        }
        for(let i = 0; i < clusterThree.length; i++){
            filteredProblems.push(clusterThree[i])
        }
        
        
        res.send(filteredProblems)
    }catch(e){
        res.status(400).send(e)
    }
})



router.post('/upvotesUpdate', auth, async (req,res) =>{


    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})

    const upvoteProblemsList = user.upvoteProblemsList
    const downvoteProblemsList = user.downvoteProblemsList
    const problemId = req.body.problemId

    const upvoteProblemsListIndex = upvoteProblemsList.indexOf(problemId)
    const downvoteProblemsListIndex = downvoteProblemsList.indexOf(problemId)
  

    try{
    //if upvote doesnt exit already for the particular problem
    if(upvoteProblemsListIndex === -1){
        
            const problem = await Problem.findOne({_id:problemId})
            const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
            

            user.upvoteProblemsList.push(problemId)
            await user.save()
            problem.upvotes = problem.upvotes + 1
            await problem.save()
            
    
        
    }else{
        //if upvote exits already for the particular problem
        
            const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
            user.upvoteProblemsList.splice(upvoteProblemsListIndex,1)
            await user.save()

            const problem = await Problem.findOne({_id:problemId})
            if(problem.upvotes-1 >=0)
            {
                problem.upvotes = problem.upvotes - 1
            }
           
            await problem.save()
            
        
    }
    

    if(downvoteProblemsList !== undefined){
        //to check if a downvote exist by the user for the particular problems
        if(downvoteProblemsListIndex !== -1){
            
                const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
                user.downvoteProblemsList.splice(downvoteProblemsListIndex,1)

                await user.save()
    
                const problem = await Problem.findOne({_id:problemId}) 
                if(problem.downvotes-1 >=0)
                 {
                    problem.downvotes = problem.downvotes - 1
                }   
                await problem.save()
            
            
        }
    }
    res.status(200).send("Upvote successfull")

}catch(e){
    console.log(e)
    res.status(400).send(e)
}
 
})

router.post('/downvotesUpdate', auth, async (req,res) =>{


    const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})

    const upvoteProblemsList = user.upvoteProblemsList
    const downvoteProblemsList = user.downvoteProblemsList
    const problemId = req.body.problemId

    const upvoteProblemsListIndex = upvoteProblemsList.indexOf(problemId)
    const downvoteProblemsListIndex = downvoteProblemsList.indexOf(problemId)  

    try{
    //if upvote doesnt exit already for the particular problem
    if(downvoteProblemsListIndex === -1){
        
            const problem = await Problem.findOne({_id:problemId})
            const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
            

            user.downvoteProblemsList.push(problemId)
            await user.save()
            problem.downvotes = problem.downvotes + 1
            await problem.save()
            
    
        
    }else{
        //if upvote exits already for the particular problem
        
            const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
            user.downvoteProblemsList.splice(downvoteProblemsListIndex,1)
            await user.save()

            const problem = await Problem.findOne({_id:problemId})
            if(problem.downvotes-1 >=0)
            {
               problem.downvotes = problem.downvotes - 1
            }   
            await problem.save()
                
    }

    if(upvoteProblemsList !== undefined){
        //to check if a downvote exist by the user for the particular problems
        if(upvoteProblemsListIndex !== -1){
            
                const user = await User.findOne({_id:req.user.id == undefined ? req.user._id : req.user.id})
                user.upvoteProblemsList.splice(upvoteProblemsListIndex,1)

                await user.save()
    
                const problem = await Problem.findOne({_id:problemId}) 
                if(problem.upvotes-1 >=0)
                {
                problem.upvotes = problem.upvotes - 1
                }
                await problem.save()
            
            
        }
    }
    res.status(200).send("Upvote successfull")

}catch(e){
    console.log(e)
    res.status(400).send(e)
}
  
})

router.post('/problems', auth, problemImage.array('problemImage',3), async (req,res) =>{
    
    const imagesArray = []
    
    if(req.files === undefined)
    {
      
        const problem = new Problem({

            title:req.body.title,
            description:req.body.description,
            priority:req.body.priority,
            status:req.body.status,
            category:req.body.category,
            location:req.body.location,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            kind:req.body.kind,
            creatorId:req.user.id == undefined ? req.user._id : req.user.id
        })
            try{
                await problem.save()
                res.status(201).send(problem)
            }catch(e){
                res.status(400).send(e)
            }
    }
    else
    {
        req.files.forEach(element => imagesArray.push(element.buffer))
        const problem = new Problem({
            title:req.body.title,
            description:req.body.description,
            priority:req.body.priority,
            status:req.body.status,
            category:req.body.category,
            location:req.body.location,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            kind:req.body.kind,
            creatorId:req.user.id == undefined ? req.user._id : req.user.id,
            images:imagesArray
        })
        try{
            await problem.save()
            res.status(201).send(problem)
        }catch(e){
            res.status(400).send(e)
        }
    }
}, (err,req,res,next) => res.status(405).send({error:err}))

  
module.exports = router