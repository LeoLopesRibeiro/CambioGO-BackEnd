require('dotenv').config();

const jsforce = require('jsforce');
//essa conexão so é funcional na versão 1 do jsforce

const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

const conn = new jsforce.Connection({
    loginUrl: SF_LOGIN_URL,
});


conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInfo) => {
    console.log("Entrou")
    if (err) {
        console.log(err)
    }
    else {
        console.log("User ID: " + userInfo.id)
        console.log("ORG: " + userInfo.organizationId)
    }
});

// (async () =>{})


module.exports = conn;