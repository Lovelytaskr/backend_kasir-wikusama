const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"

auth = async (req, res, next) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]

    let jwtHeader = {
        algorithm: "HS256"
    }
    if(token == null){
        res.status(401).json({ message: "Unauthorized"})
    }else{
        let decodedToken;
        try{
            decodedToken = await jwt.verify(token, SECRET_KEY)
        }catch(error){
            if (error instanceof jwt.TokenExpiredError){
                return res.status(401).json({
                    message: "token expired",
                    err: error
                })
            }
            return res.status(401).json({
                message: "invalid token",
                err: error
            })
        }
        req.userData = decodedToken
        next()
    }
}



module.exports = auth