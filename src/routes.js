const express = require('express');
const routes = express.Router();
const UserController = require('./Controllers/UserController');
const { verifyJWT } = require('./Utilities/usefulFunctions')

routes.get('/user/list', UserController.getUsers);
routes.post('/login', UserController.login);
routes.post('/register', UserController.createUser);
routes.put('/user/update/:id', UserController.updateUser);
routes.delete('/user/delete/:id', UserController.deleteUser);
routes.put('/add-count/:id', UserController.addTestCount);

module.exports = routes;