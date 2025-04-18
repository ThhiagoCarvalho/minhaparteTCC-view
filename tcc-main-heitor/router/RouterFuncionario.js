const express = require('express');
const ControlFuncionario = require('../controle/controleFuncionarios');
const MiddlewareFuncionario = require('../middleware/middlewareFuncionarios');

module.exports = class RouterFuncionario {
    constructor() {
        this._router = express.Router();
        this._controleFuncionario = new ControlFuncionario();
        this._middleFuncionario = new MiddlewareFuncionario();
    }

    criarRotasFuncionario() {
       
        const multer = require('multer');
        const upload = multer({ dest: 'uploads/' }); // Configuração do multer

        this._router.post('/csv', upload.single('arquivo'), // Middleware do multer para upload do arquivo
            (req, res) => this._controleFuncionario.controle_csv_funcionarios(req, res) // Passa a referência corretamente
        );
       
        this._router.post('/login', 
            this._middleFuncionario.validarDadosFuncionario,
            this._middleFuncionario.verificarFuncionarioExistente,
            this._controleFuncionario.controle_funcionario_post
        )


        this._router.delete('/:id', 
            this._middleFuncionario.validarDadosFuncionario,
            this._middleFuncionario.verificarFuncionarioExistente,
            this._controleFuncionario.controle_funcionario_delete
        )


        this._router.put('/:id', 
            this._middleFuncionario.validarDadosFuncionario,
            this._middleFuncionario.verificarFuncionarioExistente,
            this._controleFuncionario.controle_funcionario_put
        )

        this._router.get('/buscarPagina/:id', 
            this._middleFuncionario.validarDadosFuncionario,
            this._middleFuncionario.verificarFuncionarioExistente,
            this._controleFuncionario.controle_funcionario_get_page
        )



        //esta funcao vai ser para buscar os dados do aluno tipo buscar perfil do projeto do estagio

    this._router.get('/buscarPerfil/:id',
        this._controleFuncionario.controle_funcionario_get_perfil
      );


        return this._router

    }
};
