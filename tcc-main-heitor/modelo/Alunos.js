const Banco = require("./Banco")

module.exports = class Aluno {

    constructor() {
        this._matricula = null
        this._nome = ""
        this._turma = ""
        this._nascimento = null
        this._curso = ""

    }

    async getAluno() {
        const conexao = Banco.getConexao();
        console.log(this.matricula);
        const mysql = "SELECT * FROM Aluno WHERE matricula = ?";

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



    async createFromCsv() {

        const conexao = Banco.getConexao()
        const mysql = "insert into Aluno (matricula,nome,turma,nascimento) values (?,?,?,?)"

        try {
            const [result] = await conexao.promise().execute(mysql, [this._matricula, this._nome, this._turma, this._nascimento])
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro >>" + error)
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

    async update(matriculaAntes) {
        console.log("CURSO" + this.curso)
        const conexao = Banco.getConexao();
        const sql = `UPDATE Aluno 
                     SET matricula = ?, nome = ?, turma = ?, nascimento = ?, curso = ?
                     WHERE matricula = ${matriculaAntes}`;

        try {
            const [result] = await conexao.promise().execute(sql, [
                this._matricula,
                this._nome,
                this._turma,
                this._nascimento,
                this.curso
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro ao atualizar aluno >> " + error);
        }
    }


    async delete() {
        const conexao = Banco.getConexao();
        const sql = "DELETE FROM Aluno WHERE matricula = ?";

        try {
            const [result] = await conexao.promise().execute(sql, [this._matricula]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro ao deletar aluno >> " + error);
        }
    }

    async ReadPage(pagina) {
        let itensPorPagina = 10;
        let inicio = (pagina - 1) * itensPorPagina;

        const conexao = Banco.getConexao();
        const sql = `SELECT * FROM Aluno LIMIT ${inicio} , ${itensPorPagina}`;

        try {
            const [rows] = await conexao.promise().execute(sql);
            return rows;
        } catch (error) {
            console.log("Erro ao buscar alunos paginados >> " + error);
            return [];
        }
    }

    async cadastro() {
        const conexao = Banco.getConexao();

        const mysql = "INSERT INTO Aluno (matricula, nome, turma, nascimento,curso) VALUES (?, ?, ?,?, ?)";

        try {
            const [result] = await conexao.promise().execute(mysql, [this.matricula, this.nome, this.turma, this.nascimento, this.curso]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro ao cadastrar aluno >> " + error);
            return false;
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


    get curso() {
        return this._curso;
    }

    set curso(valor) {
        this._curso = valor;
    }

    get nascimento() {
        return this._nascimento;
    }

    set nascimento(valor) {
        this._nascimento = new Date(valor);

    }

}