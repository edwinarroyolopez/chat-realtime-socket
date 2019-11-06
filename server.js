const pool = require('./data/db')
const io = require('socket.io')(3000)

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

const users = {}

io.on('connection', socket => {
    console.log('new User')
    socket.on('new-user', name => {

        getData().then((data) => {
            console.log('courses', data)
        });


        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
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
