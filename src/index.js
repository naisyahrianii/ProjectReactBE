const express = require('express')
const app = express()
const port = 2019
const userRouter = require('./routers/userRouters')

app.get('/', (req, res) => {
    res.send(`<h1>Api running on PORT </h1>`)
})

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log("Running at ", port);
    
})

