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
            this._middleFuncionario.validar_cpf,
            this._middleFuncionario.validar_senha,

            this._middleFuncionario.verificarFuncionarioExistente,
            this._controleFuncionario.controle_funcionario_login
        )

        this._router.post('/', 
            this._middleFuncionario.validar_nome,
            this._middleFuncionario.validar_registro,
            this._middleFuncionario.validar_cpf,
            this._middleFuncionario.validar_senha,
            
            this._middleFuncionario.verificarFuncionarioNaoExistente,
            this._controleFuncionario.controle_funcionario_post
        )


        this._router.delete('/:registro', 
            this._middleFuncionario.verificarFuncionarioExistente2,
            this._controleFuncionario.controle_funcionario_delete
        )


        this._router.put('/:registro', 
            this._middleFuncionario.validar_nome,
            this._middleFuncionario.verificarCpfDuplicado,
            this._middleFuncionario.validar_senha,
            this._middleFuncionario.verificarFuncionarioExistente2,
            this._controleFuncionario.controle_funcionario_put
        )

        this._router.get('/buscarPagina/:id', 
            this._controleFuncionario.controle_funcionario_get_page
        )

        this._router.get('/cargos/', 
            this._controleFuncionario.controle_funcionario_get_cargos
        )
        return this._router

    }
};
