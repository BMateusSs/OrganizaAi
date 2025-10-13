import db from '../../connection.js'

export async function createProject(userId, infos){
    const name = infos.name
    const color = infos.color
    const layout = infos.layout

    let query = `INSERT INTO projects(user_id, name, color, layout_type)
                 VALUES(?, ?, ?, ?)
                `
    const [result] = await db.execute(query, [userId, name, color, layout])
    const projectId = result.insertId
    
    if (layout === 'KANBAN'){
        query = `INSERT INTO kanbans(name, project_id)
                 VALUES(?, ?)
                `
        await db.execute(query, ['Quadro Principal', projectId])
    }

    return projectId
}

export async function readProject(userId){
    const query = `
        SELECT p.id, p.name, p.description, p.created_at, p.color, p.layout_type, p.color, c.code 
        FROM projects AS p
        LEFT JOIN colors AS c
        ON p.color = c.color
        WHERE p.user_id = ?;
    `

    const [rows, fields] = await db.execute(query, [userId])

    return rows
}