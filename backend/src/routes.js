const express = require('express');
const routes = express.Router();
const cors = require("cors");
const fs = require('fs');

routes.use(express.json());
//url do frontend
routes.use(
  cors({
    origin: "http://localhost:3000",
  })
);


routes.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('usuarios.txt', 'utf8', (err, dados) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler o arquivo' });
    }

    const users = JSON.parse(dados);
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      return res.status(200).json(user.nivel); // Retorna apenas o nivel do usuario
    } else {
      return res.status(401).json({ message: 'Credenciais invalidas' });
    }
  });
});


routes.post('/cadastrarUser', (req, res) => {
  const usersJson = JSON.stringify(req.body, null, 2);
  fs.writeFile('usuarios.txt', usersJson, (err) => {
    if (err) {
      throw err;
    } else {
      return res.status(200).json('Arquivo gravado com sucesso');
    }
  });
});

routes.post('/cadastrarPaciente', (req, res) => {
  const pacienteJson = JSON.stringify(req.body, null, 2);
  fs.writeFile('pacientes.txt', pacienteJson, (err) => {
    if (err) {
      throw err;
    } else {
      return res.status(200).json('Arquivo gravado com sucesso');
    }
  });
});


routes.get('/buscaUsuario', (req, res) => {

  fs.readFile('usuarios.txt', 'utf8', (err, dados) => {
    if (err) {
      res.status(404).json('Arquivo não encontrado'); 
    } else {
      // Verifica se o arquivo está vazio
      if (!dados || dados.trim() === '') {
        res.status(404).json('Nenhum usuario encontrado');
      } else {
        try {
          const usuarios = JSON.parse(dados); //converte para JSON
          res.json(usuarios);
        } catch (error) {
          res.status(500).json('Erro ao processar os dados'); // Se houver error ao transformar em json
        }
      }
    }
  });
});

routes.get('/buscaPaciente', (req, res) => {

  fs.readFile('pacientes.txt', 'utf8', (err, dados) => {
    if (err) {
      res.status(404).json('Arquivo não encontrado'); 
    } else {
      // Verifica se o arquivo está vazio
      if (!dados || dados.trim() === '') {
        res.status(404).json('Nenhum paciente encontrado');
      } else {
        try {
          const pacientes = JSON.parse(dados); //converte para JSON
          res.json(pacientes);
        } catch (error) {
          res.status(500).json('Erro ao processar os dados'); // Se houver error ao transformar em json
        }
      }
    }
  });
});

routes.get('/nivel/:nivel', (req, res) => {
  const nivel = req.params.nivel; // Captura o nivel da URL
  fs.readFile('usuarios.txt', 'utf8', (err, dados) => {
    if (err) throw err;

    const users = JSON.parse(dados);
    const user = users.filter(user => user.nivel === nivel);

    if (user) {
      res.status(200).json(user); // Retorna o usuário encontrado que seja do nivel escolhido
    } else {
      res.status(404).json({ user: 'Nivel nao encontrado' }); // Retorna erro se não encontrado
    }
  });

});

routes.delete('/deletePaciente/:cpf', (req, res) => {
  const cpf = req.params.cpf;

  // Lê o arquivo pacientes.txt
  fs.readFile('pacientes.txt', 'utf8', (err, dados) => {
    if (err) {
      // Se ocorrer erro na leitura do arquivo
      return res.status(500).json({ message: 'Erro ao ler o arquivo' });
    }

    try {
      // Converte os dados do arquivo em um array de objetos
      const pacientes = JSON.parse(dados);

      // Filtra os usuários removendo o que tem o CPF especificado
      const pacientesAtualizados = pacientes.filter(pacientes => pacientes.cpf !== cpf);

      // Verifica se algum usuário foi removido
      if (pacientes.length === pacientesAtualizados.length) {
        // Nenhum usuário com o CPF encontrado
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Grava o novo array de usuários no arquivo pacientes.txt
      fs.writeFile('pacientes.txt', JSON.stringify(pacientesAtualizados, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao salvar o arquivo' });
        }

        // Retorna sucesso se o usuário foi removido
        res.json({ message: 'Pacientes removido com sucesso' });
      });

    } catch (error) {
      // Se houver um erro ao fazer o parsing dos dados JSON
      res.status(500).json({ message: 'Erro ao processar os dados' });
    }
  });
});

module.exports = routes;