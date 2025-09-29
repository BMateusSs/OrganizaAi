import bcryptjs from 'bcryptjs'

export async function hashPassword(password){
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    return hash
}

export async function verifyPassword(hash, password) {
    const result = await bcryptjs.compare(password, hash)
    return result
}

