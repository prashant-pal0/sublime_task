require("dotenv").config();
const { pool, Client } = require('pg')


const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})
client.connect();


const customersTableQuery = `
CREATE TABLE customers (
    id varchar(50) not null primary key,
    first_name varchar(200) not null,
    last_name varchar(200) not null,
    city varchar(200) not null,
    company varchar(200) not null
);
`
createTable(customersTableQuery)

async function createTable(query) {
    try {
        const res = await client.query(query);
        console.log('Table is successfully created:', res);
    } catch (err) {
       // console.log("already exist", err)
    }
}

exports.module = { client }