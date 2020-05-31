const chalk = require('chalk');
log = console.log;

module.exports = (req, res, next) => {
    log(chalk.blueBright(`req.headers.auth_token: `)+chalk.magenta(req.headers.auth_token));
    log(chalk.red(`ip--->${req.ip}`));
    log(chalk.red(`hostname--->${req.hostname}`));
    const header = req.headers['auth_token'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        console.log(chalk.red(`auth_token not found in headers.`))
        res.sendStatus(403)
    }
}
