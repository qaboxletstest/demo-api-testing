const js2xmlparser = require("js2xmlparser");

const simpleAuth = (req, res, next) => {
    const auth = { login: 'admin', password: 'admin' }
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    if (login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next()
    } else {
        let obj = { error: 'unauthorized' };
        if (req.accepts('json')) {
            res.header('Content-Type', 'application/json');
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send(obj);
        } else if (req.accepts('application/xml')) {
            res.header('Content-Type', 'application/xml');
            res.set('WWW-Authenticate', 'Basic realm="401"')
            var xml = js2xmlparser.parse("response", obj);
            res.status(401).send(xml);
        } else {
            res.send(406);
        }
    }
}

module.exports = simpleAuth