const Aluno = require("../modelo/Alunos");
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const upload = multer({ dest: 'uploads/' });
const TokenJWT = require("../modelo/MeuTokenJWT");

module.exports = class MiddlewareAluno {

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

            req.body = { alunos: registros };
          }

          if (!req.body || !req.body.alunos || req.body.alunos.length === 0) {
            return res.status(400).json({ msg: 'Nenhum dado de aluno foi fornecido' });
          }

          next();
        } catch (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Erro ao processar o arquivo CSV', erro: err.message });
        }
      }
    ];
  }

  normalizarAlunos = (body) => {
    if (Array.isArray(body.alunos)) return body.alunos;
    if (body.alunos) return [body.alunos];
    if (Array.isArray(body)) return body;
    return [body];
  }

  validar_nome = (req, res, next) => {
    const alunos = this.normalizarAlunos(req.body);
    for (let i = 0; i < alunos.length; i++) {
      const nome = alunos[i]?.nome?.trim();
      const identificador = alunos.length === 1 ? "" : `do aluno ${i + 1}`;
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

  validar_matricula = async (req, res, next) => {
    const alunos = this.normalizarAlunos(req.body);
    for (let i = 0; i < alunos.length; i++) {
      const { matricula } = alunos[i];
      const identificador = alunos.length === 1 ? "" : `do aluno ${i + 1}`;
      const objAluno = new Aluno();
      objAluno.matricula = matricula;
      const jaExiste = await objAluno.getAluno();

      if (!matricula || matricula.length < 1) {
        return res.status(400).json({
          cod: 2,
          status: false,
          msg: `A matrícula ${identificador} é inválida.`,
        });
      }

      if (jaExiste) {
        return res.status(400).json({
          cod: 3,
          status: false,
          msg: `A matrícula ${identificador} já está em uso.`,
        });
      }
    }
    next();
  }

  validar_turma = (req, res, next) => {
    const alunos = this.normalizarAlunos(req.body);
    for (let i = 0; i < alunos.length; i++) {
      const { turma } = alunos[i];
      const identificador = alunos.length === 1 ? "" : `do aluno ${i + 1}`;
      if (!turma || turma.length < 1) {
        return res.status(400).json({
          cod: 4,
          status: false,
          msg: `A turma ${identificador} é obrigatória.`,
        });
      }
    }
    next();
  }

  validar_nascimento = (req, res, next) => {
    const alunos = this.normalizarAlunos(req.body);
    for (let i = 0; i < alunos.length; i++) {
      const { nascimento } = alunos[i];
      const identificador = alunos.length === 1 ? "" : `do aluno ${i + 1}`;
      if (!nascimento || !/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
        return res.status(400).json({
          cod: 5,
          status: false,
          msg: `A data de nascimento ${identificador} é inválida. Use o formato: AAAA-MM-DD.`,
        });
      }
    }
    next();
  }

  validar_curso = (req, res, next) => {
    const alunos = this.normalizarAlunos(req.body);
    for (let i = 0; i < alunos.length; i++) {
      const { curso } = alunos[i];
      const identificador = alunos.length === 1 ? "" : `do aluno ${i + 1}`;
      if (!curso || curso.length < 3) {
        return res.status(400).json({
          cod: 6,
          status: false,
          msg: `O curso ${identificador} é inválido ou muito curto.`,
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

  async verificarAlunoExistente(req, res, next) {
    try {
      const matricula = req.params.matricula;
      const objAluno = new Aluno();
      objAluno.matricula = matricula
      const alunoExistente = await objAluno.getAluno();

      if (!alunoExistente) {
        return res.status(404).json({
          error: 'Aluno não encontrado.',
          status: false
        });
      } else {
        req.aluno = objAluno;
        next();
      }

    } catch (error) {
      console.error('Erro ao verificar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }


  

  async verificarAlunoNaoExistente(req, res, next) {
    try {
      const matricula = req.body.matricula;
      const objAluno = new Aluno();
      objAluno.matricula = matricula
      const alunoExistente = await objAluno.getAluno();

      if (alunoExistente) {
        return res.status(409).json({
          error: 'Aluno já existente.',
          status: false
        });
      } else {
        req.aluno = objAluno;
        next();
      }

    } catch (error) {
      console.error('Erro ao verificar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

}