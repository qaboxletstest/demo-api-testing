const js2xmlparser = require("js2xmlparser");

const check = (req, res, obj) => {
    if (req.accepts('json')) {
        res.header('Content-Type', 'application/json');
        res.status(400).send(obj);
    } else if (req.accepts('application/xml')) {
        res.header('Content-Type', 'application/xml');
        const xml = js2xmlparser.parse("response", obj);
        res.status(400).send(xml);
    } else {
        res.send(406);
    }
}

function checkContentType(req, res, next) {
    let contentType = req.get('Content-Type');
    let reqMethod = req.method;
    let obj = { error: 'Please send request in application/json content-type format only!!!' };
    if (reqMethod === "POST" || reqMethod === "PUT" || reqMethod === "PATCH") {
        if (contentType === undefined || (contentType != 'application/json' && !(contentType.includes("multipart/form-data")))) {
            check(req, res, obj)
        } else {
            next();
        }
    } else {
        next();
    }
}

module.exports = checkContentType