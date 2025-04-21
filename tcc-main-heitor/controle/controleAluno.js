const express = require('express');
const Aluno = require("../modelo/Alunos");
const fs = require('fs');
const readline = require('readline');
const multer = require('multer');
const MeuTokenJWT = require(".././modelo/MeuTokenJWT")

// Configuração do multer para salvar arquivos temporariamente
const upload = multer({ dest: 'uploads/' }); // Diretório temporário para arquivos

module.exports = class controlAluno {
  async controle_csv_aluno(request, response) {
    try {
        const  file  = request.file; 
        console.log("file" + file)// Multer adiciona o arquivo na propriedade "file"
      if (!file || !file.path) {
        return response.status(400).json({ error: 'Arquivo CSV não encontrado!' });
      }

      const ponteiroArquivo = fs.createReadStream(file.path); // Abre o arquivo CSV
      const leitorLinha = readline.createInterface({
        input: ponteiroArquivo,
        crlfDelay: Infinity, // Processa as quebras de linha corretamente
      });

      let i = 0;
      const objAluno = [];
      let qtdAlunosDuplicados = 0;
      const alunosDuplicados = [];

      for await (const linhaArquivo of leitorLinha) {
        const campos = linhaArquivo.split(';'); // Divide a linha em colunas

        const aluno = new Aluno();
        aluno.matricula = campos[0];
        aluno.nome = campos[1];
        aluno.turma = campos[2];
        aluno.nascimento = campos[3];
        const existeAluno = await aluno.getAluno()
        console.log("existeAluno" + existeAluno)
        if (!existeAluno) {
          const Alunoscriados = await aluno.createFromCsv();
          if (Alunoscriados) {
            objAluno.push(aluno);
            i++;
          }
        } else {
          qtdAlunosDuplicados++;
          alunosDuplicados.push(campos[1]); // Adiciona o nome do aluno duplicado
        }
      }

      console.log('Alunos processados:', objAluno);
      console.log('Quantidade de Alunos duplicados:', qtdAlunosDuplicados);
      console.log('Alunos duplicados:', alunosDuplicados);

      // Retorna a resposta
      response.status(200).json({
        message: 'Arquivo processado com sucesso!',
        processados: objAluno.length,
        duplicados: qtdAlunosDuplicados,
      });
    } catch (error) {
      console.error("Error>>>>>" + error);
      response.status(500).json({ error: 'Erro interno do servidor!' });
    }
  }


  async controle_aluno_login (request , response)  {
    const objAluno = request.aluno
    const objToken = new MeuTokenJWT ()
    const objClaimsToken = {
      matricula: objAluno.matricula
    }
    
    const novoToken = objToken.gerarToken(objClaimsToken)

    const objResposta = {
      resposta : "Sucesso ao logar" ,
      token : novoToken,
      Usuario : objAluno
    }
    response.status(200).send(objResposta);

  }

  async controle_aluno_getMatricula (request , response)  {
    const objAluno = new Aluno()
    objAluno.matricula = request.params.id
    const matricula =  await objAluno.getMatricula ( )
    console.log(matricula)
    const objResposta = {
      matriculas : matricula
    }
    response.status(200).send(objResposta);

  }


  async controle_aluno_put(req, res) {
    try {
        const matricula = req.body.matricula;
        const nome = req.body.nome;
        const turma = req.body.turma;
        const nascimento = req.body.nascimento;
        const curso = req.body.curso;

        const objAluno = new Aluno();
        objAluno.matricula =matricula;
        objAluno.nome= nome;
        objAluno.turma =turma;
        objAluno.nascimento=nascimento;
        objAluno.curso=curso;

        const matriculaAntes = req.params.matricula
        const sucesso = await objAluno.update(matriculaAntes);

        const resposta = {
            resposta: sucesso ? "Aluno atualizado com sucesso" : "Aluno não encontrado ou sem alteração",
            status: sucesso
        };

        res.status(sucesso ? 200 : 404).send(resposta);
    } catch (error) {
        console.log("Erro >>>", error);
        res.status(500).send({ resposta: "Erro interno", status: false });
    }
}


async controle_aluno_delete(req, res) {
  try {
      const matricula = req.params.matricula;

      const objAluno = new Aluno();
      objAluno.matricula = matricula;

      const sucesso = await objAluno.delete();

      const resposta = {
          resposta: sucesso ? "Aluno deletado com sucesso" : "Aluno não encontrado",
          status: sucesso
      };

      res.status(sucesso ? 200 : 404).send(resposta);
  } catch (error) {
      console.log("Erro >>>", error);
      res.status(500).send({ resposta: "Erro interno", status: false });
  }
}

async controle_aluno_post(req, res) {
  try {
      const matricula = req.body.matricula;
      const nome = req.body.nome;
      const turma = req.body.turma;
      const nascimento = req.body.nascimento;
      const curso = req.body.curso;


      const objAluno = new Aluno();
      objAluno.matricula = matricula;
      objAluno.nome= nome;
      objAluno.turma =turma;
      objAluno.nascimento=nascimento;
      objAluno.curso=curso;


      const sucesso = await objAluno.cadastro();

      const resposta = {
          resposta: sucesso ? "Aluno cadastrado com sucesso" : "Erro ao cadastrar aluno",
          status: sucesso
      };

      res.status(sucesso ? 201 : 400).send(resposta);
  } catch (error) {
      console.log("Erro >>>", error);
      res.status(500).send({ resposta: "Erro interno", status: false });
  }
}


async controle_aluno_get_page(req, res) {
  try {
      const pagina = parseInt(req.params.id);

      const objAluno = new Aluno();
      const alunos = await objAluno.ReadPage(pagina);

      const resposta = {
          resposta: "Alunos encontrados com sucesso",
          dados: alunos,
          status: true
      };

      res.status(200).send(resposta);
  } catch (error) {
      console.log("Erro >>>", error);
      res.status(500).send({ resposta: "Erro interno", status: false });
  }
}


//esta funcao vai ser para buscar os dados do aluno tipo buscar perfil do projeto do estagio
async controle_aluno_get_perfil(req, res) {
  try {
      const id = req.params.id;

      const objAluno = new Aluno();
      objAluno.id  = id
      const alunos = await objAluno.getAluno();

      const resposta = {
          resposta: "Aluno encontrado com sucesso",
          dados: alunos,
          status: true
      };

      res.status(200).send(resposta);
  } catch (error) {
      console.log("Erro >>>", error);
      res.status(500).send({ resposta: "Erro interno", status: false });
  }
}



};