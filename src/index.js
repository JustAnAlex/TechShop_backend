const path = require('path')

//
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: path.resolve(process.cwd(), 'prod.env') })
} else {
    require('dotenv').config()
}


const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fileupload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const  app = express()

app.use(cors())
app.use(express.json())
app.use(express.static( path.resolve(__dirname, 'static') ))
app.use(fileupload({}))

app.use('/api', router)
app.use('/', (req, res) => res.send("That server work!"))

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()  // сверять состояние бд со схемой бд
        app.listen(PORT, () => console.log(`sever start on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()