import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function hashPassword(password){
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    return hash
}

export async function verifyPassword(hash, password) {
    const result = await bcryptjs.compare(password, hash)
    return result
}

export function createToken(userId){
    const SECRET = process.env.SECRET_KEY
    const payload = {userId: userId}
    const options = {expiresIn: '2h'}
    const token = jwt.sign(payload, SECRET, options)

    return token
}

export function validateToken(req, res, next) {
    const header = req.headers['authorization']
    console.log('HEADER: ', header)
    const token = header && header.split(" ")[1]
    console.log('TOKEN: ', token)

    if (!token){
        return res.status(401).json({message: 'Token não encontrado'})
    }

    try{
        console.log('ENTROU NO TRY')
        const SECRET = process.env.SECRET_KEY
        console.log('SECRET KEY: ', SECRET)
        const payload = jwt.verify(token, SECRET)
        console.log('PAYLOAD: ', payload)
        req.userId = payload.userId
        next()
    }catch(err){
        console.log('ENTROU NO CATCH')
        return res.status(403).json({message: 'Token inválido ou expirado'})
    }
}