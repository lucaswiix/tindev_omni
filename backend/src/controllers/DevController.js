const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;
        
        const loggedDev = await Dev.findById(user);

        if(!loggedDev)
            return res.json({error: "Dev not exists"});
        
        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },
            ],
        });

        return res.json(users);
    },
    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if(userExists) 
            return res.json(userExists);
        
        
       await axios.get(`https://api.github.com/users/${username}`).then(async response => {
            const { name, bio, avatar_url : avatar } = response.data;

            const dev = await Dev.create({
                name,
                user: username,
                bio,
                avatar,
            });
            
            return res.json(dev);

        }).catch(error => {
            const { status } = error.response;
            
            if(status == 404)
                return res.json({error: 'User dont found' });
            else
                return res.json({error: 'I dont know, some error happended'});
        });
        

       
    }
};