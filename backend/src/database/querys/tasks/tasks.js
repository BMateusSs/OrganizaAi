import db from '../../connection.js'

export async function createTask(task_info){
    const userId = task_info.user_id
    const title = task_info.title
    const description = task_info.description || null

    const projectId = task_info.project_id || null; 
    const columnId = task_info.column_id || null;

    const due_date = task_info.due_date || null
    const isHabit = task_info.is_habit 
    const recurrence =  isHabit ? (task_info.recurrence || null) : null

    const query = `INSERT INTO tasks 
               (user_id, title, description, due_date, project_id, column_id, is_habit, recurrence) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

    const task = [userId, 
                  title, 
                  description, 
                  due_date,
                  projectId,
                  columnId, 
                  isHabit, 
                  recurrence]

    const [result] = await db.execute(query, task)

    return result.insertId
}

export async function readTask(user_id){
    const query = `
        SELECT t.id, t.column_id, t.description, t.title, p.id, p.name, p.color, c.code
        FROM tasks t
        LEFT JOIN projects p
        ON t.project_id = p.id
        LEFT JOIN colors c 
        ON p.color = c.color
        WHERE t.user_id = 8 AND t.due_date = CURDATE() AND t.completed = 0;
    `

    const [rows, fields] = await db.execute(query, [user_id])
    return rows
}

export async function checkCompleted(userId, taskId, isCompleted){
    
    const query = `
        UPDATE tasks
        SET completed = ?,
            completed_at = CASE WHEN ? THEN NOW() ELSE NULL END
        WHERE user_id = ? AND id = ?
    `

    const values = [isCompleted, isCompleted, userId, taskId]
    const [result] = await db.execute(query, values)
    return result.affectedRows

}

function buildUpdateQuery(user_id, task_id, updates){
    const placeHolders = []
    const values = []

    for (const key in updates){
        if (Object.prototype.hasOwnProperty.call(updates, key)){
            placeHolders.push(`${key} = ?`)
            values.push(updates[key])
        }
    }

    const setContent = placeHolders.join(', ')
    const query = `UPDATE tasks SET ${setContent} WHERE user_id = ? AND id = ?`
    values.push(user_id)
    values.push(task_id)

    return {query, values}
}

export async function readProjectTasks(user_id, project) {
    let query;
    let params = [user_id];

    if (project) {
        query = `
            SELECT * FROM tasks
            WHERE project_id = ? AND user_id = ? AND completed = 0;
        `;
        params.unshift(project); 

    } else {
        query = `
            SELECT * FROM tasks
            WHERE project_id IS NULL AND user_id = ? AND completed = 0;
        `;
    }

    const [rows, fields] = await db.execute(query, params);

    return rows;
}

export async function updateTask(user_id, task_id, updates) {
    const {query, values} = buildUpdateQuery(user_id, task_id, updates);
    const [result] = await db.execute(query, values);
    return result.affectedRows;
}

export async function completedTasks(userId){
    const query = `
        SELECT * 
        FROM tasks
        WHERE user_id = ? AND completed = 1
        ORDER BY completed_at DESC;
    `

    const [rows, fields] = await db.execute(query, [userId])
    
    const intervals = await createIntervals(rows)
    return intervals
}

async function createIntervals(rows) {
    let intervals = {}
    for ( const object of rows){
        
        let date = object.completed_at
        
        let dateObj = new Date(date)
        const onlyDate = dateObj.toISOString().split('T')[0]
        
        if (intervals[onlyDate]){
            intervals[onlyDate].push(object)

        }else {
            intervals[onlyDate] = []
            intervals[onlyDate].push()
            intervals[onlyDate].push(object)
            
        }
        
    }
    return intervals

}
