import db from '../../connection.js'
import { hashPassword } from '../../../utils/auth.js'

async function verifyCredentials(username, email){
    const query = 'SELECT id FROM users WHERE username = ? OR email = ?'

    const [rows, fields] = await db.execute(query, [username, email])
    const user = rows.length > 0

    if (user){
        return false
    }

    return true
}

async function register(name, username, email, password){

    const hash = await hashPassword(password)
    const user = [name, username, email, hash]

    const isValid = await verifyCredentials(username, email)
    if (isValid){
        const query = 'INSERT INTO users(name, username, email, password) VALUES (?, ?, ?, ?)'
        await db.execute(query, user)

        return {status: true, message: 'Cadastrado com sucesso'}

    }

    return {status: false, message: 'Email ou usuário inválidos'}
}

export default register;