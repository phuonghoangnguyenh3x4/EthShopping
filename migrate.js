const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password: '',
    database: 'eth_shop',
});

app.listen(port, () => {
    console.log(`Migration listening at http://localhost:${port}`)
})

connection.connect(async function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    await dropTable();
    await createTable();
});

async function dropTable() {
    let sql = "DROP TABLE IF EXISTS products";

    await connection.query(sql, (err, res) => {
        if (err) throw err;

        console.log('drop products table !');        
    });
}

async function createTable() {
    console.log('Creating table....');

    let sql = 'CREATE TABLE products(id          int                           , \
                                     type        varchar(255)                  , \
                                     producer    varchar(255)                  , \
                                     description text                          , \
                                     image       text                          , \
                                     email       varchar(255)                  , \
                                     phone       varchar(255)                  , \
                                     PRIMARY KEY (id)                            \
                                    )';
    
    await connection.query(sql, (err, res) => {
        if (err) throw err;

        console.log('products table created !');        
        console.log('Done !');        
    });
}