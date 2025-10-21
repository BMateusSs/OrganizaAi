import db from '../../connection.js'

export async function createHabit(userId, habitInfo) {
    const title = habitInfo.title;
    const description = habitInfo.description || null;

    const recurrence = habitInfo.recurrence; 

    const dueDate = null;
    const projectId = null;
    const columnId = null;

    const isHabit = true;
    const parentHabitId = null;

    const query = `
        INSERT INTO Tasks 
        (user_id, title, description, due_date, project_id, column_id, 
         is_habit, recurrence, parent_habit_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        userId, 
        title, 
        description, 
        dueDate, 
        projectId, 
        columnId, 
        isHabit, 
        recurrence, 
        parentHabitId 
    ];

    const [result] = await db.execute(query, values);
    
    return result.insertId;
}