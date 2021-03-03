require ('dotenv').config()
const massive = require('massive')
const session = require('express-session')
const express = require ('express')
const ctrl = require('./controllers/movies.js')
const app = express()

const { SERVER_PORT, CONNECTION_STRING} = process.env

app.use(express.json())

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*24*365}
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false},
})
.then(db => {
    app.set('db', db);
    console.log('db connected')
})
.catch(err => console.log(err))

app.post('/api/auth/register', userCtrl.register)
app.post('/api/auth/login', userCtrl.login)
app.post('/api/auth/me', userCtrl.getUser)
app.post('/api/auth/logout', userCtrl.logout)

app.get('/api/movies', ctrl.getMovies)
app.post('/api/movies', ctrl.addMovie)
app.put('/api/movies/:id', ctrl.editMovie)
app.delete('/api/movies/:id', ctrl.deleteMovie)

app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))

