const express = require('express');
const routes = express.Router();
const UserController = require('./Controllers/UserController');

routes.get('/user/list', UserController.getUsers);
routes.get('/login', UserController.login);
routes.post('/register', UserController.createUser);
routes.put('/user/update/:id', UserController.updateUser);
routes.delete('/user/delete/:id', UserController.deleteUser);

module.exports = routes;