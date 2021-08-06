const Users = require('../Models/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    hashPass
} = require('../Utilities/usefulFunctions');

const addTestCount = async (req, res) => {
    const { id } = req.params;
    const { count } = req.body;

    try {
        const updatedUser = await Users.findOneAndUpdate({ _id: id }, {
            testesSemanais: count
        }, { new: true });
        return res.json(updatedUser);
    } catch (err) {
        return res.json(err);
    }
}

const getUsers = async (req, res) => {
    return res.json(await Users.find());
};

const createUser = async (req, res) => {
    const {
        username, email, pass, role
    } = req.body;

    try {
        const newUser = await Users.create({
            username,
            email,
            pass: await hashPass(pass),
            role
        });
        return res.json(newUser);
    } catch (err) {
        if (err.code === 11000) {
            return res.json({ 'err': 'duplicated' });
        }
        return res.json(err);
    };
}

const login = async (req, res) => {
    const user = await Users.findOne({ username: req.body.username });
    if (!user) {
        return res.json({ "message": "The user does not exist" });
    }
    if (await bcrypt.compare(req.body.pass, user.pass)) {
        const { id } = user;
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 43200,
        });
        const profile = { ...user._doc };
        delete profile.pass;
        return res.json({ auth: true, token, profile });
    }
    return res.json({ message: "incorrect password" });
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        username, email, pass
    } = req.body;

    if (!username || !email || !pass) {
        return res.json({ "message": "invalid values" });
    }

    try {
        const updatedUser = await Users.findOneAndUpdate({ _id: id }, {
            username,
            email,
            pass: await hashPass(pass)
        }, { new: true });
        return res.json(updatedUser);
    } catch (err) {
        return res.json(err);
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await Users.deleteOne({ _id: id });
        if (deleteUser.deletedCount == 1) {
            return res.json({ 'message': 'ok' })
        } 
        return res.json({ 'message': 'error when deleting user' })
    } catch (err) {
        return res.json({err});
    }
};

module.exports = {
    getUsers, createUser, login, updateUser, deleteUser, addTestCount
}