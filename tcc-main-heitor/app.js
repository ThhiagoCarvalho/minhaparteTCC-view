const express = require('express');
const path = require('path');
const app = express();
const portaServico = 3000;
const RouterAluno = require("./router/RouterAluno");
const RouterFuncionario = require("./router/RouterFuncionario");
const RouterOcorrencia = require("./router/RouterOcorrencia");

app.use(express.json());
app.use(express.static('js'));
app.use('/html', express.static(path.join(__dirname, 'view/html')));
app.use('/css', express.static(path.join(__dirname, 'view/css')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/html/paginaInicial.html'));
});

const roteadorAluno = new RouterAluno();
const roteadorFuncionario = new RouterFuncionario();
const roteadorOcorrencia = new RouterOcorrencia();

app.use('/alunos', roteadorAluno.criarRotasAlunos());
app.use('/funcionarios', roteadorFuncionario.criarRotasFuncionario());
app.use('/ocorrencias', roteadorOcorrencia.criarRotasOcorrencia());

app.listen(portaServico, () => {
    console.log("Api rodando na porta " + portaServico);
    
});