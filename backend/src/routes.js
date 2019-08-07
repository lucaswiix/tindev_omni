const express = require('express');
const routes = express.Router();
const devController = require('./controllers/DevController');
const likeController = require('./controllers/LikeController');
const dislikeController = require('./controllers/DislikeController');


routes.get('/devs', devController.index);
routes.post('/devs', devController.store);
routes.post('/devs/:devId/likes', likeController.store)
routes.post('/devs/:devId/dislikes', dislikeController.store)

module.exports = routes;