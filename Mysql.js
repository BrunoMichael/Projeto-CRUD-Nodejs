const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'SEU_HOST',
    user: 'SEU_USUARIO',
    database: 'SEU_DATABASE',
    password: 'SUA_SENHA'
    // Adicione a opção SSL aqui, se necessário
});

module.exports = pool.promise();