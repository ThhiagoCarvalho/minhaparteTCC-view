const Banco = require("./Banco")


module.exports = class Ocorrencia {

    constructor() {
        this._idOcorrencia = null;
        this._alunoMatricula = null;
        this._tipoOcorrenciaIdTipoOcorrencia = null;
        this._funcionarioRegistroOrientador = null;
        this._funcionarioRegistroProfessor = null;
        this._reladoFuncionario = "";
        this._relatoAluno = "";
        this._condutaOrientacao = "";
        this._statusOcorrenciaIdStatusOcorrencia = null;
        this._momento = null;
    }

    async create_ocorrencia () { 
        const conexao = Banco.getConexao();
        const mysql = "INSERT INTO Ocorrencia (Aluno_matricula, TipoOcorrencia_idTipoOcorrencia, Funcionario_registro_Orientador, Funcionario_registro_Professor, reladoFuncionario, relatoAluno, condutaOrientacao, StatusOcorrencia_idStatusOcorrencia, momento) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try {
            const [result] = await conexao.promise().execute(mysql, [this.alunoMatricula,this.tipoOcorrenciaIdTipoOcorrencia,this.funcionarioRegistroOrientador,this.reladoFuncionario,this.relatoAluno,this.condutaOrientacao,this.statusOcorrenciaIdStatusOcorrencia,this.momento]);
            return result.affectedRows > 0
        } catch (error) {
            console.log("Erro>>" + error);
            return false;
        }
    }

    get idOcorrencia() {
        return this._idOcorrencia;
    }

    set idOcorrencia(value) {
        this._idOcorrencia = value;
    }

    get alunoMatricula() {
        return this._alunoMatricula;
    }

    set alunoMatricula(value) {
        this._alunoMatricula = value;
    }

    get tipoOcorrenciaIdTipoOcorrencia() {
        return this._tipoOcorrenciaIdTipoOcorrencia;
    }

    set tipoOcorrenciaIdTipoOcorrencia(value) {
        this._tipoOcorrenciaIdTipoOcorrencia = value;
    }

    get funcionarioRegistroOrientador() {
        return this._funcionarioRegistroOrientador;
    }

    set funcionarioRegistroOrientador(value) {
        this._funcionarioRegistroOrientador = value;
    }

    get funcionarioRegistroProfessor() {
        return this._funcionarioRegistroProfessor;
    }

    set funcionarioRegistroProfessor(value) {
        this._funcionarioRegistroProfessor = value;
    }

    get reladoFuncionario() {
        return this._reladoFuncionario;
    }

    set reladoFuncionario(value) {
        this._reladoFuncionario = value;
    }

    get relatoAluno() {
        return this._relatoAluno;
    }

    set relatoAluno(value) {
        this._relatoAluno = value;
    }

    get condutaOrientacao() {
        return this._condutaOrientacao;
    }

    set condutaOrientacao(value) {
        this._condutaOrientacao = value;
    }

    get statusOcorrenciaIdStatusOcorrencia() {
        return this._statusOcorrenciaIdStatusOcorrencia;
    }

    set statusOcorrenciaIdStatusOcorrencia(value) {
        this._statusOcorrenciaIdStatusOcorrencia = value;
    }

    get momento() {
        return this._momento;
    }

    set momento(value) {
        this._momento = value;
    }



}