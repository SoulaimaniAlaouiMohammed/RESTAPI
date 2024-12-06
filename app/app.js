const http = require('http')
const PORT = 3000
const { 
    deleteUserById,
    getAllUsers,
    getUserById,
    saveUser,
    updateUser
 } = require('./persistance.js')
const { sendResponse, handleError } = require('./Utils.js')



const server = http.createServer((req, res) => {

    const {url, method} = req

    if (url.toLowerCase() === '/users' && method === 'GET')
    {
        getAllUsers()
        .then(result => sendResponse(res, 200, result))
        .catch(e => handleError(res, e, msg))
    }
    else if (url.toLowerCase().startsWith('/users/') && method === 'GET')
    {
        const id = url.split('/')[2]

        getUserById(id)
        .then(result => result == null ? sendResponse(res, 404, `User with id ${id} not exist.`) 
        : sendResponse(res, 200, result))
        .catch(e => handleError(res, e, msg))
    }
    else if (url.toLowerCase() == '/users' && method === 'POST')
    {
        let body = ""
        req.on("data", (chunk) => (body += chunk.toString()))

        req.on("end", () => {
            const userData = JSON.parse(body)
            saveUser(userData)
            .then(async result => !result ? sendResponse(res, 404, `User not added with success, please try again.`) 
            : await getAllUsers().then(data => sendResponse(res, 200, data)))
            .catch(e => handleError(res, e, msg))
        })
    }
    else if (url.toLowerCase().startsWith('/users/') && method === 'DELETE')
    {
        const id = url.split('/')[2]

        deleteUserById(id)
        .then(async result => !result ? sendResponse(res, 404, `User with id ${id} not exist.`)
        : await getAllUsers().then(data => sendResponse(res, 200, data)))
        .catch(e => handleError(res, e, msg))
    }
    else if (url.toLowerCase().startsWith('/users/') && method === 'PUT')
    {
        const id = url.split('/')[2]

        let body = ""
        req.on("data", (chunk) => (body += chunk.toString()))

        req.on("end", () => {
            const newData = JSON.parse(body)

            updateUser(id, newData)
            .then(result => !result ? sendResponse(res, 404, `User with id ${id} not exist.`)
            : getUserById(id).then(data => sendResponse(res, 200, data)))
            .catch(e => handleError(res, e, msg))
        })
    }
    else
    {
        try {
            sendResponse(res, 404, `Error 404. Page not found.`)
        } catch (e) {
            handleError(res, e, msg)
        }
    }

})


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})