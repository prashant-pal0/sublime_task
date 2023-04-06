
const env = require("dotenv");
env.config();
const uuid = require("uuid")
const connection = require('../Model/Database')

exports.addCustomer = async (req, res) => {
    try {
        const { first_name, last_name, city, company } = req.body;

        if (!first_name || !last_name || !city || !company) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const query = `SELECT * FROM customers WHERE first_name = '${first_name}' AND last_name = '${last_name}' AND city = '${city}' AND company = '${company}'`
        const customers = await connection.module.client.query(query)

        if (customers.rows.length) {
            throw ("Customer already exist")
        }

        const customerId = uuid.v4();
        const insertQuery = `INSERT INTO customers ("id", "first_name", "last_name", "city", "company") VALUES ('${customerId}', '${first_name}','${last_name}','${city}','${company}')`
        const resp = await connection.module.client.query(insertQuery)
        console.log(resp)
        const newCustomer = {
            id: customerId,
            first_name,
            last_name,
            city,
            company,
        };
        res.status(200).send({
            success: true,
            message: "INSERT VALUE",
            values: newCustomer
        })
        connection.module.client.end;
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        })
    }
}


exports.getCustomers = async (req, res) => {
    try {
        let { first_name, last_name, city, limit, page } = req.query
        
        first_name = first_name ? first_name : ''
        last_name = last_name ? last_name : ''
        city = city ? city : ''
        limit = limit ? limit : 100
        page = page ? page : 1
        const skip = limit * (page - 1)
        console.log(first_name, last_name, city, limit, page)
        const customer = `SELECT * FROM "customers" WHERE "first_name" = '${first_name}' OR "last_name"='${last_name}' OR "city" = '${city}'  OFFSET '${skip}' LIMIT '${limit}'`
        const customers = await connection.module.client.query(customer)
        res.send({
            success: true,
            data: customers.rows
        })
        connection.module.client.end;
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        })
    }
}

exports.getCustomersById = async (req, res) => {
    try {
        const { customer_id } = req.params
        const customerById = `SELECT * FROM customers WHERE id='${customer_id}'`
        const customers = await connection.module.client.query(customerById)
        res.send({
            success: true,
            data: customers.rows
        })
        connection.module.client.end;
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        })
    }
}

exports.getCustomersByCities = async (req, res) => {
    try {
        const query = `SELECT DISTINCT city, COUNT(first_name) as Customers FROM customers GROUP BY city`
        const cities = await connection.module.client.query(query)
        res.send({
            success: true,
            data: cities.rows
        })
        connection.module.client.end;
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        })
    }
}