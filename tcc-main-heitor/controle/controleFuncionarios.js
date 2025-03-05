const express = require('express');
const Funcionario = require("../modelo/Funcionarios");
const fs = require('fs');
const MeuTokenJWT = require(".././modelo/MeuTokenJWT")
const multer = require('multer');
const readline = require('readline');


module.exports = class ControlFuncionario {

    async controle_csv_funcionarios(request, response) {
        try {
            const file = request.file; // Multer adiciona o arquivo na propriedade "file"

            if (!file || !file.path) {
                return response.status(400).json({ error: 'Arquivo CSV não encontrado!' });
            }

            const ponteiroArquivo = fs.createReadStream(file.path); // Abre o arquivo CSV
            const leitorLinha = readline.createInterface({
                input: ponteiroArquivo,
                crlfDelay: Infinity, // Processa as quebras de linha corretamente
            });

            let i = 0;
            const objFuncionario = [];
            let qtdFuncionariosDuplicados = 0;
            const funcionariosDuplicados = [];

            for await (const linhaArquivo of leitorLinha) {
                const campos = linhaArquivo.split(';'); // Divide a linha em colunas

                const funcionario = new Funcionario();
                funcionario.registro = campos[0];
                funcionario.nome = campos[1];
                funcionario.cpf = campos[2];
                funcionario.senha = campos[3];
                funcionario.TipoFuncionario_idTipoFuncionario = campos[4];

                const existeFuncionario = await funcionario.getFuncionario();
                console.log("existeFuncionario" + existeFuncionario);

                if (!existeFuncionario) {
                    const funcionariosCriados = await funcionario.createFromCsv();
                    if (funcionariosCriados) {
                        objFuncionario.push(funcionario);
                        i++;
                    }
                } else {
                    qtdFuncionariosDuplicados++;
                    funcionariosDuplicados.push(campos[1]);
                }
            }

            console.log('Funcionários processados:', objFuncionario);
            console.log('Quantidade de Funcionários duplicados:', qtdFuncionariosDuplicados);
            console.log('Funcionários duplicados:', funcionariosDuplicados);

            response.status(200).json({
                message: 'Arquivo processado com sucesso!',
                processados: objFuncionario.length,
                duplicados: qtdFuncionariosDuplicados,
            });
        } catch (error) {
            console.error("Error>>>>" + error);
            return response.status(500).json({ error: 'Erro interno do servidor!' });
        }
    }

    async controle_funcionario_login(req, res) {
        try {
            const req_objFuncionario = req.funcionario;
            const objToken = new MeuTokenJWT();
            const senha = req.body.senha;

            const objClaimsToken = {
                cpf: req_objFuncionario.cpf,
                senha: senha,
            };

            const novoToken = objToken.gerarToken(objClaimsToken);
        

            const objResposta = {
                resposta: "Sucesso ao logar",
                token: novoToken,
                Funcionario: req_objFuncionario,
                cargo : req_objFuncionario.TipoFuncionario_idTipoFuncionario,
                status: true
            };

            res.status(200).send(objResposta);
        } catch (error) {
            console.log("Errro >>>" , error)
            return false
        }
    }

}
