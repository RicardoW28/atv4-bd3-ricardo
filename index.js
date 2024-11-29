// Importação dos pacotes
const express = require('express');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

// Instâncias
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://rrwinchester2003:inpIjMAvi7zyYtyY@cluster0.pfm7g.mongodb.net/meuBancoDeDados?retryWrites=true&w=majority')
    .then(() => console.log("Conectado ao MongoDB com sucesso!"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// Definindo a localização da pasta estática
app.use(express.static(path.join(__dirname, 'public')));

// Definindo o EJS como motor de visualização
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);

// Rota principal
app.get('/', (req, res) => {
    res.render('index.html');
});

// Cria conexão com o socket.io
io.on('connection', socket => {
    console.log('Novo usuário conectado. ID: ' + socket.id);
});

// Criação do servidor HTTP
server.listen(3000, () => {
    console.log('Servidor funcionando em http://localhost:3000');
});

// Definição do esquema e modelo do MongoDB
const mensagemSchema = new mongoose.Schema({
    data_hora: Date,
    mensagem: String,
    contato: String
});

const Mensagem = mongoose.model('Mensagem', mensagemSchema);

// Funções para listar e procurar mensagens
async function listarMensagensOrdemEnvio() {
    const mensagensOrdenadas = await Mensagem.find().sort({ data_hora: 1 });
    console.log(mensagensOrdenadas);
}

async function listarMensagensOrdemInversa() {
    const mensagensInversas = await Mensagem.find().sort({ data_hora: -1 });
    console.log(mensagensInversas);
}

async function procurarMensagemPorTrecho(trecho) {
    const resultado = await Mensagem.find({ mensagem: new RegExp(trecho, 'i') });
    console.log(resultado);
}

// Exemplos de uso das funções (descomente para testar)
// listarMensagensOrdemEnvio();
// listarMensagensOrdemInversa();
// procurarMensagemPorTrecho("projeto");