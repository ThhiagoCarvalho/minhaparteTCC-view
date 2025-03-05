const Banco = require("./Banco")

module.exports = class Funcionario {

    constructor() { 
        this._registro= ""
        this._nome = ""
        this._senha = ""
        this._cpf= ""
        this._TipoFuncionario_idTipoFuncionario = null
    }
    
    async getFuncionario(registrocpf) {
        const conexao = Banco.getConexao();        
        const mysql = "SELECT * FROM Funcionario WHERE senha = ? and (registro = ? OR cpf = ? )";
        
        try {
            const [result] = await conexao.promise().execute(mysql, [this._senha, registrocpf, registrocpf]);
            
            if (result.length === 1) {
                const funcionario = result[0];
                this._nome = funcionario.nome;
                this._cpf = funcionario.cpf;
                this._TipoFuncionario_idTipoFuncionario = funcionario.TipoFuncionario_idTipoFuncionario;
                return true;
            }
            return false;
        } catch (error) {
            console.log("Erro>>" + error);
            return false;
        }
    }
    

    async createFromCsv() {
        const conexao = Banco.getConexao();
        const mysql = "INSERT INTO Funcionario (registro, nome, cpf, senha,TipoFuncionario_idTipoFuncionario) VALUES (?, ?, ?, ?,?)";
        
        try {
            const [result] = await conexao.promise().execute(mysql, [this._registro,this.nome,this._cpf,this._senha,this._TipoFuncionario_idTipoFuncionario]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro >>" + error);
        }
    }
    get registro() {
        return this._registro;
    }

    set registro(value) {
        this._registro = value;
    }

    get nome() {
        return this._nome;
    }

    set nome(value) {
        this._nome = value;
    }

    get cpf() {
        return this._cpf;
    }

    set cpf(value) {
        this._cpf = value;
    }

    get senha() {
        return this._senha;
    }

    set senha(value) {
        this._senha = value;
    }

    get TipoFuncionario_idTipoFuncionario() {
        return this._TipoFuncionario_idTipoFuncionario;
    }

    set TipoFuncionario_idTipoFuncionario(value) {
        this._TipoFuncionario_idTipoFuncionario = value;
    }

}