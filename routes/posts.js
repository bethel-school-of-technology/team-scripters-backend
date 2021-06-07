var express = require('express');
const { route } = require('.');
var router = express.Router();
var Post = require('../models/posts')


//add a new post
router.post('/posts', async (req,res,next) => {

    try{
      console.log(req.body)
       let newPost = new Post({
         title: req.body.title,
         body: req.body.body,
         published: req.body.published
       });
       
       //console.log(newPost)
       let result = await newPost.save();
       //console.log(result);
       res.json({
         message: "Post created successfuly",
         status: 200
       })
    }
    catch(err){
     console.log(err);
     res.json({
       message: "Post not created successfully",
       status: 403,
     })
    }
   })

   //Get all posts 
router.get('/posts', async (req,res,next) => {
    
    Post.find({
        title: req.body.title,
        body: req.body.body,
        published: req.body.published
    })
    })  
   
    
    
//Get post by ID 
router.get('/posts/:id', async (req,res,next) => {

    Post.findById(req.params._id, (error, data) => {
        if (error) {
            return next(error)
        } 
        else {
            res.json(data)
        }
    })

})

//Update post 
router.put('/edit-post/:id', async (req,res,next) => {

    Post.findByIdAndUpdate(req.params._id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('Post updated successfully')
        }
    })
    })

//Delete a book
router.delete('/delete-post/:id', async (req,res,next) => {
    
    Post.findByIdAndRemove(req.params._id, (error, data) => {
        if(error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = router;