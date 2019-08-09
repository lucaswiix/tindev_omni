const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        try {
            const { user } = req.headers;
        
        const loggedDev = await Dev.findById(user);

        if(!loggedDev)
            return res.status(404).json({error: "Dev not exists"});
        
        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },
            ],
        });
        console.log(`Listing devs to user ${loggedDev.user}`)
        return res.json(users);
        } catch (error) {
            console.log('Error in try list Devs');            
            return res.status(400).json({error: 'Error on try get data'});            
        }
        
    },
    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if(userExists){
            console.log(`User ${userExists.user} already exists`);
            return res.json(userExists);
        }
        
        
       await axios.get(`https://api.github.com/users/${username}`).then(async response => {
            const { name, bio, avatar_url : avatar } = response.data;

            const dev = await Dev.create({
                name,
                user: username,
                bio,
                avatar,
            });
            
        console.log(`Created user ${username}`)

            return res.json(dev);

        }).catch(error => {
            const { status } = error.response;
            
            if(status == 404){
                console.log(`User ${username} dont found`);
                return res.status(400).json({error: 'User dont found' });
            }
            else{
                return res.status(400).json({error: 'I dont know, some error happended'});
            }
        });
        

       
    }
};