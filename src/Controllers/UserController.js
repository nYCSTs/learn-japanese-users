const Users = require('../Models/UserSchema');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    hashPass
} = require('../Utilities/usefulFunctions');

const getUsers = async (req, res) => {
    return res.json(await Users.find());
};

const createUser = async (req, res) => {
    const {
        username, email, pass
    } = req.body;

    try {
        const newUser = await Users.create({
            username,
            email,
            pass: await hashPass(pass)
        });
        return res.json(newUser);
    } catch (err) {
        return res.json(err);
    };
}

const login = async (req, res) => {
    const user = await Users.findOne({ username: req.body.username });
    if (!user) {
        return res.json({ "message": "The user does not exist" });
    }
    if (await bcrypt.compare(req.body.pass, user.pass)) {
        // const { id } = user;
        // const token = jwt.sign({ id }, process.env.SECRET, {
        //     expiresIn: 43200,
        // });
        const profile = { ...user._doc };
        delete profile.pass;
        // return res.json({ auth: true, token, profile });
        return res.json({ auth: true, profile });
    }
    return res.json({ "message": "incorrect password" });
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

    const deletedUser = Users.findOneAndDelete({ _id: id });
    return res.json(deletedUser);
};

module.exports = {
    getUsers, createUser, login, updateUser, deleteUser
}