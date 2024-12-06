const fs = require('fs')
const dbPath = './../database.json'

// GET All the Users.
const getAllUsers = async () => {

    try {
        // Here we must use try and catch cuz we are using parse method.
        const users = await fs.promises.readFile(dbPath)

        return JSON.parse(users.toString()).users

    } catch (e) {
        console.error(`We can't fetch all the users, please try again, there's an error, ${e}`)
    }

}
// getAllUsers()
// .then(res => console.log(res))     ==>   This is success.



// GET a User By Id.   ==>  This function return a boolean (true or false) promises
const getUserById = async (_id) => {

    const users = await getAllUsers()

    const user = users.find(u => u.id == _id)

    return user || null

}
// getUserById(1)
//     .then(res => {
//         if (res == null) console.log('User with this id not exist.')
//         else console.log(res)
//     })
//     .catch(e => console.error(e))    ==>  This is work with success.



// POST a User with their attributes (id, username, age)
// and this function take a User object as input.
const saveUser = async (User) => {

    try {

        const data = await fs.promises.readFile(dbPath)

        const users = JSON.parse(data.toString()).users

        users.push(User)

        const newUsers = { users }

        await fs.promises.writeFile(dbPath, JSON.stringify(newUsers, null, 3))

        return true

    } catch (e) {
        console.error(e)
        return false
    }

}
// saveUser({id: 10, username: "test", age: 10})
//     .then(() => {
//         getAllUsers()
//         .then(res => console.log(res))
//     })
//     .catch(e => console.error(e))               ==>   This work with success.




// DELETE a User By Id
// this function return a boolean promise.
const deleteUserById = (_id) => {

    return getUserById(_id)
    .then(async (res) => {

        if (!res) return false
        else {

            const data = await fs.promises.readFile(dbPath)

            const users = JSON.parse(data.toString()).users

            const newUsers = users.filter(u => u.id != _id)

            const result = {users: newUsers}

            await fs.promises.writeFile(dbPath, JSON.stringify(result, null, 3))

            return true

        }
    })

}
// deleteUserById(10)
//     .then((result) => {
//         if (!result) console.log(`User with this id not found.`)
//         else console.log(`User with this id was deleted with success.`)
//     })
//     .catch(e => console.error(e))                                       ==>   This work with success.




// PUT (Modify User Information)
// this function take a User id, then we modify it.
const updateUser = async (_id, _data) => {

    try {

        const data = await fs.promises.readFile(dbPath)

        const users = JSON.parse(data.toString()).users

        const userIndex = users.findIndex(u => u.id == _id)

        if (userIndex === -1) return false
        
        else {
            users[userIndex] = { id: _id, ..._data }
            await fs.promises.writeFile(dbPath, JSON.stringify({ users }, null, 3))
            return true
        }

    } catch (e) {
        console.error(e)
    }

}
// updateUser(10, {username: "test2", age: 5})
//     .then(result => {
//         if (!result) console.log('User with this id not exist.')
//         else {
//             console.log('User updated with success.')
//             getUserById(10)
//         }
//     })                                                           ==>  This work with success.



module.exports = {
    getAllUsers,
    getUserById,
    saveUser,
    deleteUserById,
    updateUser
}