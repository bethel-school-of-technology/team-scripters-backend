// route to get user profile information -> /profile
router.post('/profile', async (req,res,next) => {
    //console.log(req.headers);
    let myToken = req.headers.authorization;
    console.log(myToken);
  
    if(myToken){
      let currentUser = await tokenService.verifyToken(myToken);
      console.log(currentUser);
     
      if(currentUser){
        let responseUser = {
         //ROUTE LOGIC GOES HERE 
        }
        res.json({
          message: "user profile information",
          status: 200,
          user: responseUser
        })
      }
    else{
      res.json({
        message: "Token was invalid or expired",
        status: 403,
        })
      }
    }
    else{
      res.json({
        message: "no token received",
        status: 403,
      })
    }
  })