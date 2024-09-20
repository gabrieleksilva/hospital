const express = require('express');
const arquivo_diretorio = express.Router();

const fs = require('fs');

//leitura do arquivo
fs.readFile('usuarios.txt', 'utf8', (err, dados) => {
    if(err) throw err;
    console.log(dados);
});

module.exports = arquivo_diretorio;