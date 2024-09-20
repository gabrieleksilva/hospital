const express = require('express');
const routes = express.Router();
const cors = require("cors");
const fs = require('fs');

routes.use(express.json());
routes.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const users = [{
  id: 1,
  nome: 'Gabriele',
  email: 'teste1@gmail.com',
  password: '123456'

}];

routes.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email &&
      user.password === password);
  if (user) {// se o usuario existir
      return res.status(200).json(user);
  } else {//acesso nao autorizado
      return res.send(401).json({ message: 'Credenciais invalidas' });
  }
  res.send(email);

});

module.exports = routes;