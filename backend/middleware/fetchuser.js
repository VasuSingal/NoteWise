const jwt = require('jsonwebtoken');
const JWT_SECRET = "Vasuisking#"

const fetchUser =(req, res, next) => {

    // Get the user from jwt token and add id to req odbject
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({error : "authenticate using a valid token"})
    }

    try {
        // Trying to find the user with the authentication token
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error : "Please authenticate using a valid token"})
    }
}

module.exports = fetchUser;