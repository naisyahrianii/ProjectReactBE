const router = require('express').Router()
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')

const multer = require('multer')
const conn = require('../connection/connection')
// const sendVerify = require('../emails/nodemailers')

//create customers atau users
router.post('/customers', async(req, res) => { 
    var sql1 = 'SELECT * FROM customers'
    var sql2 = 'INSERT INTO customers SET ?'
    var data = req.body

    if(!isEmail(req.body.email)) return res.send('email is not valid')

    req.body.password = await bcrypt.hash(req.body.password, 8)

    conn.query(sql2, data, (err, result) => {
        if(err) return res.send(err)

        // sendVerify(req.body.username, req.body.name, req.body.email)

        conn.query(sql1, (err, result) => {
            if(err) throw err

            res.send(result)
        })
    })
})

//get username
router.get('/customers/users', (req, res) => {
    const sql1 = `select * from customers where username = ?`
    
    const data = req.query.uname

    conn.query(sql1, data, (err, result) => {
        if(err) return res.send(err.message)

        const user = result[0]

        if(!user) return res.send('user not found')

        res.send({user})
    })
})

//update customers
router.patch('customers', (req, res) => {
    const sql1 = `update customers set ? where id = ?`
    const data = [req.body, req.params.customerid]

    conn.query(sql1, data, (err, result) => {
        if (err) return res.send(err.message)

        res.send(result)
    })
})

//delete customers
router.delete('customers', (req, res) => {
    const sql1 = `select * from customers where username = ?`
    const sql2 = `delete from customers where username = ?` 
    const data = req.query.uname

    conn.query(sql2, data, (err, result) => {
        if (err) return res.send(err.message)
    })
})

//Login user
router.post('customers/login', (req, res) => {
    const {username, password } = req.body
    const sql1 = `SELECT * FROM users WHERE username = '${username}'`

    conn.query(sql1, async(err, result) => {
        if(err) return res.send(err.message)

        const user = result[0] 
        if(!user) return res.send('user not found')

        if(!user.verified) return res.send('please verify your email') // user tidak ditemukan

        const hash = await bcrypt.compare(password, user.password)

        if (!hash) return res.send('password doesnt match')

        res.send(user)
    })
})

module.exports = router