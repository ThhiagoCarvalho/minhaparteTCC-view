const Alunos = require("../modelo/Alunos");
const express = require('express');

module.exports = class MiddlewareAluno {

  async verificarAlunoExistente(req, res, next) {
    try {
      const  matricula = req.body.matricula;

      const objAluno = new Alunos()
      objAluno.matricula = matricula
      const alunoExistente = await objAluno.getAluno();

      if (!alunoExistente) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }else {
        req.aluno = objAluno
        next()
      }

    } catch (error) {
      console.error('Erro ao verificar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }


  validarDadosAluno(req, res, next) {
    const { matricula, nome, turma, nascimento } = req.body;

    if (!matricula || !nome || !turma || !nascimento) {
      return res.status(400).json({
        error: 'Os campos matrícula, nome, turma e nascimento são obrigatórios.',
      });
    }

    // Validação simples de formato de dados (pode ser expandida conforme necessário)
    if (typeof matricula !== 'string' || typeof nome !== 'string' || typeof turma !== 'string') {
      return res.status(400).json({ error: 'Matrícula, nome e turma devem ser strings.' });
    }

    next();
  }


  validarMatricula (request,response,next)  { 
    const matricula = request.body.matricula
    if  (!matricula || matricula.length !== 8){
      return response.status(400).json({ error: 'Matrícula incorreta' });
    }else { 
      next()
    }

  }

};
