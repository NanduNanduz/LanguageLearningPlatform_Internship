const jwt = require('jsonwebtoken')

export const verifytoken= async(req,res,next)=>{
    let token=req.headers.token;
    try{
    if(!token) throw 'Unauthorized access';
    else{
        let payload=jwt.verify(token,process.env.JWT_KEY);
        if(!payload) throw 'Unauthorized access';
        next()
    }
}  catch(error) {
    console.log(error);

}

}