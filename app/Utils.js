const { error } = require("console")



const sendResponse = (res, _statusCode, _msg) => {
    res.writeHead(_statusCode, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(_msg, null, 3))
}


const handleError = (res, _error, _msg = 'Server internal error.') => {
    console.error(error)
    res.writeHead(500, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({ error: _msg }))
}


module.exports = { sendResponse, handleError }