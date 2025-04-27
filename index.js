require('dotenv').config()
const express = require('express');
const cors = require('cors')
// const conn = require('./conexao')
const app = express();
const { PORT } = process.env;
const rotaAccounts = require('./routes/accounts.routes.js');


app.use(express.json())
app.use(cors())
app.use("/accounts", rotaAccounts);


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )

    if(req.method === "OPTIONS"){
        res.header("Acess-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH")
        return res.status(200).send({})
    }

    next()
});


app.use("/", (req, res, next)=>{
    return res.status(200).send({mensagem: 'API funcionando'})
})


app.listen(PORT, () => {
    console.log('Server rodando na porta: ' + PORT)
})