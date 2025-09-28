import express from 'express'

const router = express.Router()

router.post('/login', (req, res) => {
    const user = req.body

    res.send('otimo')
     
})

export default router