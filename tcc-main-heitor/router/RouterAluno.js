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


//serve para servir como as opcoes em baixo do input, aquelas caixas de matriculas prontas 

    this._router.post('/',
      this._middleAluno.validar_matricula,
      this._middleAluno.validar_nome,
      this._middleAluno.validar_curso,
      this._middleAluno.validar_nascimento,
      this._middleAluno.validar_turma,
      this._middleAluno.verificarAlunoNaoExistente,
      this._controleAluno.controle_aluno_post
    );

    
    this._router.put('/:matricula',
      this._middleAluno.validar_nome,
      this._middleAluno.verificarMatriculaDuplicadaAluno,
      this._middleAluno.validar_curso,
      this._middleAluno.validar_nascimento,
      this._middleAluno.validar_turma,
      this._middleAluno.verificarAlunoExistente,
      this._controleAluno.controle_aluno_put
    );

    this._router.delete('/:matricula',
      this._middleAluno.verificarAlunoExistente,
      this._controleAluno.controle_aluno_delete
    );


    this._router.get('/:matricula',
      this._middleAluno.verificarAlunoExistente,
      this._controleAluno.controle_aluno_getMatricula
    );


    this._router.get('/buscarPagina/:id',
      this._controleAluno.controle_aluno_get_page
    );



    
    this._router.get('/buscarDados/maiorOcorrencias',
      this._controleAluno.controle_aluno_get_dadosTurmasMaiorOcorrencias
    );
    return this._router;
  }
}
