const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPass = async (password, saltRounds = 10) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
}

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token)  {
        return res.status(401).json({ "err": "no token was provided." });
    }

    return jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ "err": 'It was not possible to authenticate the token.' });
        }
        req.userId = decoded.id;
        next();
        return undefined;
    });
}

module.exports = {
    hashPass, verifyJWT,
};