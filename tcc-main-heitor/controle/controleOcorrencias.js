const express = require('express');
const Ocorrencia = require("../modelo/Ocorrencias");

module.exports = class ControlOcorrencia {
    async controle_post_ocorrencia (request, response) {
        try  {
            const AlunoMatricula = request.body.AlunoMatricula
            const tipoOcorrencia = request.body.tipoOcorrencia
            const RegistrofuncionarioOrientador = request.body.RegistrofuncionarioOrientador
            const RegistrofuncionarioProfessor = request.body.RegistrofuncionarioProfessor
            const relatoFuncionario = request.body.relatoFuncionario
            const relatoAluno = request.body.relatoAluno
            const conduta = request.body.conduta 
            const statusOcorrencia = request.body.statusOcorrencia 
            const momento = request.body.momento

            const objOcorrencia = new Ocorrencia ()
            objOcorrencia.alunoMatricula = AlunoMatricula
            objOcorrencia.tipoOcorrenciaIdTipoOcorrencia = tipoOcorrencia
            objOcorrencia.RegistrofuncionarioOrientador = RegistrofuncionarioOrientador
            objOcorrencia.RegistrofuncionarioProfessor = RegistrofuncionarioProfessor
            objOcorrencia.reladoFuncionario = relatoFuncionario
            objOcorrencia.relatoAluno = relatoAluno
            objOcorrencia.condutaOrientacao = conduta
            objOcorrencia.statusOcorrenciaIdStatusOcorrencia = statusOcorrencia
            objOcorrencia.momento = momento


            const ocorrenciaFeita = await objOcorrencia.create_ocorrencia()

            const objResposta = {
                status: ocorrenciaFeita,
                msg: ocorrenciaFeita ? "Ocorrência registrada com sucesso" : "Falha ao registrar a ocorrência"
            };
        
            response.status(200).send(objResposta)

        }catch(Error)  { 
            const objResposta = {
                status : false ,
                msg : "Falha ao registrar a ocorrência"
            }
            response.status(400).send(objResposta)
        }
    }
}