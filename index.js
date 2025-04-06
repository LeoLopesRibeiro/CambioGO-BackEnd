require('dotenv').config()
const express = require('express');
const conn = require('./conexao')
const app = express();
const { PORT } = process.env;
const rotaCliente = require('./routes/clientes.routes.js');


app.use(express.json())
app.use("/clientes", rotaCliente);
app.use("/", (req, res, next)=>{
    return res.status(200).send({mensagem: 'API funcionando'})
})


app.listen(PORT, () => {
    console.log('Server rodando na porta: ' + PORT)
})