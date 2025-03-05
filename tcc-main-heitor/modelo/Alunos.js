const Banco = require("./Banco")

module.exports = class Aluno {

    constructor() { 
        this._matricula = null
        this._nome = ""
        this._turma = ""
        this._nascimento = null
    }

    async getAluno() {
        const conexao = Banco.getConexao();
        console.log(this.matricula);
        const mysql = "SELECT matricula, nome, turma FROM Aluno WHERE matricula = ?";
    
        try {
            const [result] = await conexao.promise().execute(mysql, [this._matricula]);
            if (result.length === 1) {
                const aluno = result[0];
                this.matricula = aluno.matricula;
                this.nome = aluno.nome;
                this.turma = aluno.turma;
                return true;
            }
            return false;
        } catch (error) {
            console.log("Erro>>" + error);
            return false;
        }
    }
    


    async createFromCsv () {

        const conexao = Banco.getConexao()
        const mysql = "insert into Aluno (matricula,nome,turma,nascimento) values (?,?,?,?)"
        
        try {
            const [result] = await conexao.promise().execute(mysql , [this._matricula, this._nome, this._turma,this._nascimento])
            return result.affectedRows > 0;
        }catch(error) {
            console.log("Erro >>"  + error)
        }
    }


    async getMatricula() {
        const conexao = Banco.getConexao();
        const mysql = "SELECT matricula FROM Aluno WHERE matricula LIKE ? LIMIT 3;";
        try {
            const [result] = await conexao.promise().execute(mysql, [`%${this._matricula}%`]);
            return result;
        } catch (error) {
            console.log("Erro >>" + error);
        }
    }
    

    get matricula() {
        return this._matricula;
    }
    
    set matricula(valor) {
        this._matricula = valor;
    }
    
    get nome() {
        return this._nome;
    }
    
    set nome(valor) {
          this._nome = valor;
    }
    
    get turma() {
        return this._turma;
    }
    
    set turma(valor) {
        this._turma = valor;
    }
    
    get nascimento() {
        return this._nascimento;
    }
    
    set nascimento(valor) {
        this._nascimento = new Date(valor) ;

    }
    
}