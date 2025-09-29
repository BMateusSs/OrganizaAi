import express from 'express'
import login from '../database/querys/auth/login.js'

const router = express.Router()

router.post('/login', async (req, res) => {
    const user = req.body

    const result = await login(user.credential, user.password)

    if (!result.status){
        res.status(401).json({message: result.message})
    }else{
        res.status(200).json({userId: result.userId})
    }

     
})

export default router