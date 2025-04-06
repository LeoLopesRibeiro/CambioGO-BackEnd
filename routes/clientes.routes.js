const express = require('express');
const router = express.Router()
const conn = require('../conexao.js');

router.post("/cadastro", (req, res) =>{
    const {nome, email} = req.body;
    // console.log(email)
    if(!nome){
        return res.status(422).send({mensagem: "O nome é obrigatório!"})
    }
    if(!email){
        return res.status(422).send({ mensagem: "O email é obrigatório!" })
    }
    const query_get = `SELECT Account_Email__c FROM Account WHERE Account_Email__c =:? `

    // const account = conn.sobject("Account").select("Account_Email__c, Name").where(`Account_Email__c=:${email}`).execute((err, records) =>{
    //     console.log(`First Name: ${records.Name}`);
    // })
    // console.log(account)
    conn.query(query_get, [email], (err, result) =>{
        if(err){
            return res.status(500).send({ error: err })
        }
        if(result.length > 0){
            return res.status(409).send({ message: "Email ja cadastrado!" });
        }else{
            conn.sobject('Account').create({Name: nome, Account_Email__c: email})
            return res.status(200).send({
                mensagem: "Deu tudo certo",
            })
        }
    })
})

router.get("/", (req, res) => {
    const query = "SELECT Name FROM Account LIMIT 5";

    conn.query(query, (err, result) => {
        if (err) {
            return res.status(500).send({ error: err })
        }
        res.status(200).send({
            mensagem: "Deu tudo certo",
            total: result,
        })

    })
})


module.exports = router