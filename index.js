const express = require('express');
var bodyParser = require('body-parser')

const path = require('path');

const pool = require('./Mysql');

const http = require('http');
const socketIo = require('socket.io');

pool.execute('SELECT 1 + 1 AS solution')
.then(([rows, fields]) => {
    console.log('Conexão estabelecida com sucesso. Resultado da consulta: ', rows[0].solution);
})
.catch(err => {
    console.error('Erro ao conectar ao banco de dados: ', err);
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server); 

io.on('connection', (socket) => {
    console.log('Um usuário se conectou');

    socket.on('disconnect', () => {
        console.log('Um usuário se desconectou');
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

app.get('/', async (req, res) => {
    try {
        const [config] = await pool.execute('SELECT * FROM config WHERE status = "Ativo"');
        const [configs] = await pool.execute('SELECT * FROM config');

        res.render('home', { config: config[0], configs: configs /*, outros dados */ });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar a página');
    }
});

app.post('/add-config', async (req, res) => {
    try {
        const { titulo, logoescrita, logoescritanegrito, descricao, token } = req.body;

        const query = 'INSERT INTO config (titulo, logoescrita, logoescritanegrito, descricao, token, status) VALUES (?, ?, ?, ?, ?, "Inativo")';
        await pool.execute(query, [titulo, logoescrita, logoescritanegrito, descricao, token]);

        io.emit('configAdded');

        res.json({ success: true, message: 'Configuração inserida com sucesso!' });
    } catch (err) {
        console.error("Erro ao processar a requisição:", err);
        res.status(500).send('Erro interno do servidor');
    }
});

app.post('/ativar-config', async (req, res) => {
    try {
        const { id } = req.body;

        await pool.execute('UPDATE config SET status = "Inativo"');

        await pool.execute('UPDATE config SET status = "Ativo" WHERE id = ?', [id]);

        const [configs] = await pool.execute('SELECT * FROM config');

        io.emit('configuracoesAtualizadas', 'Configurações globais foram alteradas. Por favor, atualize a página com F5.');

        res.json({ success: true, configs: configs, message: 'Configurações atualizadas com sucesso' });
    } catch (err) {
        console.error("Erro ao ativar configuração:", err);
        if (!res.headersSent) {
            res.status(500).send('Erro interno do servidor');
        }
    }
});

app.post('/delete-config', async (req, res) => {
    try {
        const { id } = req.body;

        await pool.execute('DELETE FROM config WHERE id = ?', [id]);

        io.emit('configDeleted', id);

        res.json({ success: true, message: 'Configuração excluída com sucesso.' });
    } catch (err) {
        console.error("Erro ao processar a requisição de delete:", err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

app.post('/get-config', async (req, res) => {
    try {
        const { id } = req.body;
        const [config] = await pool.execute('SELECT * FROM config WHERE id = ?', [id]);

        if (config.length > 0) {
            res.json({ success: true, config: config[0] });
        } else {
            res.json({ success: false, message: 'Configuração não encontrada' });
        }
    } catch (err) {
        console.error("Erro ao buscar configuração:", err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

app.post('/editar-config', async (req, res) => {
    try {
        const { id, titulo, logoescrita, logoescritanegrito, descricao, token } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID da configuração é necessário para a edição.' });
        }

        await pool.execute('UPDATE config SET titulo = ?, logoescrita = ?, logoescritanegrito = ?, descricao = ?, token = ? WHERE id = ?', 
            [titulo, logoescrita, logoescritanegrito, descricao, token, id]);

        io.emit('configUpdated');

        res.json({ success: true, message: 'Configuração atualizada com sucesso!' });
    } catch (err) {
        console.error("Erro ao editar configuração:", err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

server.listen(5000, '0.0.0.0', () => {
    console.log('server rodando na porta 5000');
});
