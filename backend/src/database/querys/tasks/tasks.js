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

