const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const conn = require("../conexao.js");

const { login } = require("../middleware/login.js");
const jwt = require("jsonwebtoken");

const { SECRET } = process.env;


router.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;
  // console.log(email)
  if (!nome) {
    return res.status(422).send({ mensagem: "O nome é obrigatório!" });
  }
  if (!email) {
    return res.status(422).send({ mensagem: "O email é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).send({ mensagem: "A senha é obrigatória!" });
  }

  conn
    .sobject("Account")
    .select("Account_Email__c, Name")
    .where({ Account_Email__c: email })
    .execute((err, records) => {
      if (err) {
        return res.status(500).send({ error: err });
      }
      if (records.length > 0) {
        return res.status(409).send({ message: "Email já cadastrado!" });
      } else {
        bcrypt.genSalt(10, (error, salt) => {
          if (error) {
            return res.status(500).send({ error: error });
          }
          bcrypt.hash(senha, salt, (errorCrypt, hashSenha) => {
            if (errorCrypt) {
              return res.status(500).send({ error: errorCrypt });
            }

            conn.sobject("Account").create(
              {
                Name: nome,
                Account_Email__c: email,
                Active__c: "Yes",
                Password__c: hashSenha,
              },
              (err, records) => {
                if (err) {
                  return res.status(500).send({ error: err });
                }
                conn.sobject("Contact").create(
                  {
                    LastName: nome,
                    Email: email,
                    AccountId: records.id,
                  },
                  (err, recordContact) => {
                    if (err) {
                      return res.status(500).send({ error: err });
                    }
                    return res.status(201).send({
                      mensagem: "Conta criada",
                      senha: hashSenha,
                      id: records.id,
                      idContato: recordContact.id,
                    });
                  }
                );
              }
            );
          });
        });
      }
    });
});

// conn.query(query_get, [email], (err, result) =>{
//     if(err){
//         return res.status(500).send({ error: err })
//     }
//     if(result.length > 0){
//         return res.status(409).send({ message: "Email ja cadastrado!" });
//     }else{
//         conn.sobject('Account').create({Name: nome, Account_Email__c: email})
//         return res.status(200).send({
//             mensagem: "Deu tudo certo",
//         })
//     }
// })

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(422).send({ mensagem: "O email é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).send({ mensagem: "A senha é obrigatória!" });
  }

  //query para verificar se o user existe
  conn
    .sobject("Account")
    .select("Id, Account_Email__c, Password__c")
    .where({ Account_Email__c: email })
    .execute((err, records) => {
      if (err) {
        return res.status(500).send({ error: err });
      }
      if (records.length == 0) {
        return res.status(409).send({ message: "Usuario não encontrado!" });
      } else {
        bcrypt.compare(senha, records[0].Password__c, (error, results) => {
          if (error) {
            return res.status(401).send({ message: "Falha na autenticação!" });
          }
          if(!results){
            return res.status(401).send({ message: "Login invalido!" });
          }else{
            console.log(records);
            const token = jwt.sign(
              {
                id: records[0].Id,
                email: records[0].Account_Email__c,
              },
              SECRET, {expiresIn: '3h'}
            );
            res.status(200).send({
              mensagem: "Autenticação feita com sucesso!",
              token: token,
            });
          }
        });
      }
    });
});

router.get("/:id", login, (req, res) => {
  const id = req.params.id;

  res.send(`ID buscado: ${id}`);
});


router.get("/", (req, res) => {
  const query = "SELECT Name FROM Account LIMIT 5";

  conn.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    res.status(200).send({
      mensagem: "Deu tudo certo",
      total: result,
    });
  });
});

module.exports = router;
