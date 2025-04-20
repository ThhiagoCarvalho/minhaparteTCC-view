const Funcionario = require("../modelo/Funcionarios");
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const upload = multer({ dest: 'uploads/' });
const TokenJWT = require("../modelo/MeuTokenJWT");

module.exports = class MiddlewareFuncionario {

  constructor() {
    this.uploadCSV = [
      upload.single('variavelArquivo'),
      async (req, res, next) => {
        try {
          if (req.file) {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const caminhoCompleto = path.resolve(req.file.path);
            const conteudo = await fs.promises.readFile(caminhoCompleto, 'utf8');

            if (ext !== '.csv') {
              return res.status(400).json({ msg: 'Formato de arquivo não suportado (apenas .csv)' });
            }

            const registros = parse(conteudo, { columns: true, skip_empty_lines: true, trim: true });

            req.body = { funcionarios: registros };
          }

          if (!req.body || !req.body.funcionarios || req.body.funcionarios.length === 0) {
            return res.status(400).json({ msg: 'Nenhum dado de funcionário foi fornecido' });
          }

          next();
        } catch (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Erro ao processar o arquivo CSV', erro: err.message });
        }
      }
    ];
  }

  normalizarFuncionarios = (body) => {
    if (Array.isArray(body.funcionarios)) return body.funcionarios;
    if (body.funcionarios) return [body.funcionarios];
    if (Array.isArray(body)) return body;
    return [body];
  }

  validar_nome = (req, res, next) => {
    const funcionarios = this.normalizarFuncionarios(req.body);
    for (let i = 0; i < funcionarios.length; i++) {
      const nome = funcionarios[i]?.nome?.trim();
      const identificador = funcionarios.length === 1 ? "" : `do funcionário ${i + 1}`;
      if (!nome || nome.length < 3) {
        return res.status(400).json({
          cod: 1,
          status: false,
          msg: `O nome ${identificador || 'informado'} é inválido ou muito curto.`,
        });
      }
    }
    next();
  }


  validar_cpf = async (req, res, next) => {
    const funcionarios = this.normalizarFuncionarios(req.body);
    const regexCPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

    for (let i = 0; i < funcionarios.length; i++) {
      const { cpf } = funcionarios[i];
      const identificador = funcionarios.length === 1 ? "" : `do funcionário ${i + 1}`;
      const objFuncionario = new Funcionario();
      objFuncionario.cpf = cpf;
      const existeFuncionario = await objFuncionario.verificarFuncionario();

      if (!cpf || !regexCPF.test(cpf)) {
        return res.status(400).json({
          cod: 2,
          status: false,
          msg: `O CPF ${identificador} é inválido. Use o formato: 000.000.000-00`,
        });
      }

      if (existeFuncionario) {
        return res.status(400).json({
          cod: 3,
          status: false,
          msg: `O CPF ${identificador} já está cadastrado.`,
        });
      }
    }
    next();
  }



  validar_registro = async (req, res, next) => {
    const funcionarios = this.normalizarFuncionarios(req.body);
    for (let i = 0; i < funcionarios.length; i++) {
      const { registro } = funcionarios[i];
      const identificador = funcionarios.length === 1 ? "" : `do funcionário ${i + 1}`;
      const objFuncionario = new Funcionario();
      objFuncionario.registro = registro;
      const jaExiste = await objFuncionario.verificarFuncionario();

      if (!registro || registro.length < 1) {
        return res.status(400).json({
          cod: 4,
          status: false,
          msg: `O registro ${identificador} é inválido.`,
        });
      }

      if (jaExiste) {
        return res.status(400).json({
          cod: 5,
          status: false,
          msg: `O registro ${identificador} já está em uso.`,
        });
      }
    }
    next();
  }



  validar_senha = (req, res, next) => {
    const funcionarios = this.normalizarFuncionarios(req.body);
    for (let i = 0; i < funcionarios.length; i++) {
      const { senha } = funcionarios[i];
      const identificador = funcionarios.length === 1 ? "" : `do funcionário ${i + 1}`;
      if (!senha || senha.length < 6) {
        return res.status(400).json({
          cod: 6,
          status: false,
          msg: `A senha ${identificador} deve ter pelo menos 6 caracteres.`,
        });
      }
    }
    next();
  }

  validar_autenticacao = async (req, res, next) => {
    const objToken = new TokenJWT();
    const headers = req.headers['authorization'];
    if (objToken.validarToken(headers) === true) {
      return next();
    }
    return res.status(401).json({
      msg: "Token inválido",
      status: false
    });
  }




  async verificarFuncionarioExistente(req, res, next) {
    try {
      const registrocpf = req.body.registrocpf;
      const senha = req.body.senha;

      const objFuncionario = new Funcionario()
      objFuncionario.senha = senha

      const funcionarioExistente = await objFuncionario.getFuncionario(registrocpf);

      if (!funcionarioExistente) {
        return res.status(404).json({
          error: 'Funcionario não encontrado.',
          status: false
        });
      } else {
        req.funcionario = objFuncionario
        next()
      }

    } catch (error) {
      console.error('Erro ao verificar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }



  async verificarFuncionarioNaoExistente(req, res, next) {
    try {
      const registrocpf = req.body.registrocpf;
      const senha = req.body.senha;

      const objFuncionario = new Funcionario()
      objFuncionario.senha = senha

      const funcionarioExistente = await objFuncionario.getFuncionario(registrocpf);

      if (funcionarioExistente) {
        return res.status(404).json({
          error: 'Funcionario ja existente',
          status: false
        });
      } else {
        req.funcionario = objFuncionario
        next()
      }

    } catch (error) {
      console.error('Erro ao verificar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }


}