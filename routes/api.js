const express = require('express');
const router = express.Router();
const db = require('../util/db');

const uuidRegex = /([0-9a-f]{8})(?:-|)([0-9a-f]{4})(?:-|)(4[0-9a-f]{3})(?:-|)([89ab][0-9a-f]{3})(?:-|)([0-9a-f]{12})/g;

// Create a user
router.get('/create/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    if (id.match(uuidRegex)) {
        const code = db.generateCode();
        const createdUser = db.addUser(id, name, code);
        if (createdUser) {
        res.status(200).json({ 
            code: code 
        });

        } else {
            res.status(400).json({ 
                "error": true,
                "message": "User already exists"
            });
        }
    } else {
        res.status(400).json({ 
            "error": true,
            "message": "UUID is not valid"
        });
    }
});

// Request list of users
router.get('/users', (req, res) => {
    const userList = db.getUserList();
    const users = [];

    userList.forEach(user => {
        if (user.user.lastAlive - Date.now() < 60000) {
            users.push([user.user.uuid, user.user.name]);
        }
    }, this);

    res.status(200).json({ users });
});


router.get('/live/:uuid/:code', (req, res) => {
    const uuid = req.params.uuid;
    const code = req.params.code;

    if (!db.uuidExists(uuid)) {res.status(400).json({"error": true,"message": "User not alive"}); return;}
    if (!uuid.match(uuidRegex) || !code.match(uuidRegex) || db.codeByUUID(uuid) != code) {res.status(400).json({"error": true,"message": "Invalid UUID or code"});return;}
        
        db.userAlive(uuid, code);
        res.status(200).json({ "success": true });
});

router.get('/end/:user/:code', (req, res) => {
    const user = req.params.user;
    const code = req.params.code;

    if (!db.uuidExists(user)) {res.status(400).json({"error": true,"message": "User not alive"}); return;}

    if (user.match(uuidRegex) && code.match(uuidRegex)) {

    db.userRemoveUser(user, code);

    res.status(200).json({ "success": true });
    } else {
        res.status(400).json({ 
            "error": true,
            "message": "UUID is not valid"
        });
    }
});

router.get('/users/devs', (req, res) => {
    const devs = require('../util/devs.json');
    res.status(200).json({ devs });
});

module.exports = router;
