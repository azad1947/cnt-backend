module.exports = (req, res, next) => {
    console.log('req.headers--->', req.headers);
    console.log('ip,host--->', req.ip, req.host);
    const header = req.headers['auth_token'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403)
    }
}
