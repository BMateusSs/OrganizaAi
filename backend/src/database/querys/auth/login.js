import db from '../../connection.js'
import {verifyPassword } from '../../../utils/auth.js'

async function login(credential, password){
    const query = 'SELECT id, password FROM users WHERE username = ? OR email = ?'
    const [rows, fields] = await db.execute(query, [credential, credential])

    const fakeHash = "$2a$10$ABCDEFGHIJKLMNOPQRSTUVWXabcdefghijklmnopqrstuvwx12"
    const user = rows.length > 0 ? rows[0] : {'id': null, 'password': fakeHash}

    const result = await verifyPassword(user.password, password)
    if (!user.id || !result){
        return {'status': false, 'message': 'Credeenciais inválidas'}
    }

    return {'status': true, 'userId': user.id}
}

export default login