const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

module.exports.login = (req, res, next) =>{
    try {
        // const token = req.headers.authorization.split(" ")[1]
        const token = req.headers.authorization
        // console.log(req.headers.authorization)
        const decode = jwt.verify(token, SECRET)
        console.log(decode)
        next()
    } catch (error) {
        res.status(401).send({ message: "Você não tem permissão para execultar essa ação!" })
    }
   
}