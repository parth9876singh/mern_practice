const jwt = require('jsonwebtoken');
const { findById } = require('../model/user.model');

exports.protect = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) return res.status(401).send('Invalid token');

    try {
        const decode = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decode;
        next();
    } catch (err) {
        console.log("Token verification failed:", err.message);
        res.status(401).send('Not authorized');
    }
};

const adminAuthenticate = (req, res) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ msg: 'access denied.' })
    }
}

