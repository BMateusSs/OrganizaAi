import express from 'express'
import login from '../database/querys/auth/login.js'
import register from '../database/querys/auth/register.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    const user = req.body

    const result = await register(user.name, user.username, user.email, user.password)

    if (!result.status){
        res.status(401).json({message: result.message})
    }else{
        res.status(201).json({message: result.message})
    }
})

router.post('/login', async (req, res) => {
    const user = req.body

    const result = await login(user.credential, user.password)

    if (!result.status){
        res.status(401).json({message: result.message})
    }else{
        res.status(200).json({token: result.token})
    }

})

export default router