var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Abhiisagood$footballer';

const fetchuser = (req, res, next)=>{       //req, res, next takes a middleware. Middleware is a function
                //get the user from the jwt token and add id to req object 
                const token = req.header('auth-token');
                if(!token){  //if token not present
                    res.status(401).send({error: "Please authenticate using a valid token"});
                }
                try {
                    const data = jwt.verify(token, JWT_SECRET);
                    req.user = data.user;
                    next();
                    
                } catch (error) {
                    res.status(401).send({error: "Please authenticate using a valid token"});
                }
                

}

module.exports = fetchuser;