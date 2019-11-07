
const controller = require('./data/controller')
const io = require('socket.io')(3001)
/* 
const  getData = async () => {
    let courses = []
    try {
        const client = await pool.connect()
        const { rows } = await client.query('SELECT * FROM course')
        courses = rows
    } catch (error) {
      console.error('error', error)
        //  errorHandler(error)
    }
    return courses
}
*/

const users = {}

io.on('connection', socket => {
    console.log('new User')
    socket.on('new-user', name => {

        controller.createUser(name)
        /*
        controller.getUsers().then((data) => {
            console.log('courses', data)
        });
        */

        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)

        controller.getUsers().then((data) => {
            
            socket.emit('users-available', data)

            console.log('users', data)
        });
    })

    socket.on('login-user', name => {
        users[socket.id] = name
        console.log('login: ', name)
    })

    socket.on('send-chat-message', message => {
        console.log(message)
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})
