const Funcionario = require("../modelo/Funcionarios");
const express = require('express');


module.exports = class MiddlewareFuncionario {

  async verificarFuncionarioExistente(req, res, next) {
    try {
      console.log("Chegou verificarFuncionario");
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


    validarDadosFuncionario(req, res, next) {
      const registrocpf = req.body.registrocpf;
      const senha = req.body.senha;

      if (!registrocpf || !senha) {
        return res.status(400).json({
          error: 'Preencha todos os campos!',
          status: false
        });
      }
      next();
    }
}