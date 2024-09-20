const express = require('express'); //
//importar a nova rota
const routes = require('./routes');
const app = express();//

app.use(express.json());
app.use(routes);

//primeira rota
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(3001, () => {
    console.log("conectando porta padrão 3001");
});