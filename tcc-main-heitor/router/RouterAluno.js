const express = require('express');
const controlAluno = require("../controle/controleAluno");
const MiddlewareAluno = require("../middleware/middlewareAluno");

module.exports = class RouterAluno {

  constructor() {
    this._router = express.Router();
    this._controleAluno = new controlAluno();
    this._middleAluno = new MiddlewareAluno();
  }

  criarRotasAlunos() {
    const multer = require('multer');
    const upload = multer({ dest: 'uploads/' }); // Configuração do multer

    this._router.post('/csv', upload.single('arquivo'),
      (req, res) => this._controleAluno.controle_csv_aluno(req, res) // Passa a referência corretamente
    );


    this._router.post('/login',
      this._middleAluno.validarMatricula,
      this._middleAluno.verificarAlunoExistente,
      this._controleAluno.controle_aluno_login
    );

//serve para servir como as opcoes em baixo do input, aquelas caixas de matriculas prontas 

    this._router.get('/matriculas/:matricula',
      this._controleAluno.controle_aluno_getMatricula
    );



    this._router.get('/buscarPagina/:id',
      this._controleAluno.controle_aluno_get_page
    );

//esta funcao vai ser para buscar os dados do aluno tipo buscar perfil do projeto do estagio

    this._router.get('/buscarPerfil/:id',
      this._controleAluno.controle_aluno_get_perfil
    );

    return this._router;
  }
}
