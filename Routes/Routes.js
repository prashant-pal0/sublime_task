const User = require('../Controller/User')
const express = require('express')
const Router = express.Router();

Router.post('/addCustomer',User.addCustomer)
Router.get('/getCustomers',User.getCustomers)
Router.get('/getCustomersById/:customer_id',User.getCustomersById)
Router.get('/getCustomersByCities',User.getCustomersByCities)

module.exports =Router;