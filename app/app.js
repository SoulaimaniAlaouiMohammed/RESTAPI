const http = require('http')
const PORT = 3000
const { 
    deleteUserById,
    getAllUsers,
    getUserById,
    saveUser,
    updateUser
 } = require('./persistance.js')



const server = http.createServer((req, res) => {

    const {url, method} = req

    if (url.toLowerCase() === '/users' && method === 'GET')
    {
        getAllUsers()
        .then(result => res.write(JSON.stringify(result, null, 3)))
        .catch(e => console.error(e))
        .finally(() => res.end())
    }
    else if (url.toLowerCase().startsWith('/users/') && method === 'GET')
    {
        const id = url.split('/')[2]

        getUserById(id)
        .then(result => result == null ? res.write(`User with id ${id} not exist.`) : res.write(JSON.stringify(result, null, 3)))
        // .then(result => {
        //     if (result == null) res.write(`User with id ${id} not exist.`)
        //     else {
        //         res.write(JSON.stringify(result, null, 3))
        //     }
        // })
        .catch(e => console.error(e))
        .finally(() => res.end())
    }
    else if (url.toLowerCase() == '/users' && method === 'POST')
    {
        let body = ""

        req.on("data", (chunk) => {
            body += chunk.toString()
        })

        req.on("end", () => {
            const userData = JSON.parse(body)
            saveUser(userData)
            .then(async result => {
                if (!result) res.write('User not added, please try again.')
                else {
                    await getAllUsers()
                    .then(r => res.write(JSON.stringify(r, null, 3)))
                }
            })
            .catch(e => console.error(e))
            .finally(() => res.end())
        })
    }
    else if (url.toLowerCase().startsWith('/users/') && method === 'DELETE')
    {
        const id = url.split('/')[2]

        deleteUserById(id)
        .then(async result => {
            if (!result) {
                res.write(`User with id ${id} not deleted with success.`)
                res.end()
            }
            else {
                await getAllUsers()
                .then(result => res.write(JSON.stringify(result, null, 3)))
                .catch(e => console.error(e))
                .finally(() => res.end())
            }
        })
    }
    else if (url.toLowerCase().startsWith('/users/') && method === 'PUT')
    {
        const id = url.split('/')[2]

        let body = ""

        req.on("data", (chunk) => {
            body += chunk.toString()
        })

        req.on("end", () => {
            const newData = JSON.parse(body)

            updateUser(id, newData)
            .then(result => {
                if (!result) {
                    res.write(`User with id ${id} exist.`)
                    res.end()
                }
                else {
                    getUserById(id)
                    .then(data => res.write(JSON.stringify(data, null, 3)))
                    .catch(e => console.error(e))
                    .finally(() => res.end())
                }
            })
        })
    }
    else
    {
        try {
            res.write('Error 404.')
        } catch (e) {
            console.error(e)
        } finally {
            res.end()
        }
    }

})


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})