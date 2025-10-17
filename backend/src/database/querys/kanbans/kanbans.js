import db from '../../connection.js'

export async function createColumn(userId, projId, name, order) {
    const query = `
        INSERT INTO columns_kanban(project_id, name, \`order\`)
        VALUES(?, ?, ?);
    `

    const values = [projId, name, order]
    const [result] = await db.execute(query, values)

    return result.insertId
}

export async function updateColumnId(userId, taskId, columnId){
    const query = `
        UPDATE tasks
        SET column_id = ?
        WHERE user_id = ? AND id = ?;
    `

    const values = [columnId, userId, taskId]
    const [result] = await db.execute(query, values)

    return result.affectedRows
}

