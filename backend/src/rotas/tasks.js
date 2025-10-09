import { Router } from 'express';
import { createTask, readTask, checkCompleted } from '../database/querys/tasks/tasks.js';
import { validateToken } from '../utils/auth.js';

const tasksRouter = Router(); 

tasksRouter.post('/create_task', async (req, res) => {
    const task_infos = req.body;
    
    try {
        const taskId = await createTask(task_infos);

        return res.status(201).json({
            message: "Tarefa criada com sucesso.",
            id: taskId 
        });

    } catch (error) {
        console.error("Erro ao criar tarefa:", error); 
        
        return res.status(500).json({ 
            message: "Falha ao criar tarefa devido a um erro interno do servidor."
        });
    }
});

tasksRouter.get('/read_task', validateToken, async (req, res) => {
    try {
        const user_id = req.userId
        const tasks = await readTask(user_id)
        console.log('USER: ', user_id)
        console.log(tasks)

        res.status(200).json({tasks})

    }catch (error){
        res.status(500).json({message: "Erro ao buscar tarefas"})
    }
})

tasksRouter.post('/complete_task', validateToken, async (req, res) => {
    try {
        const userId = req.userId
        const isCompleted = req.body.isCompleted
        const taskId = req.body.taskId

        const rowUpdate = await checkCompleted(userId, taskId, isCompleted)

        return res.status(200).json({message: 'Tarefa atualizada com sucesso!', rows: rowUpdate})
        
    }catch(error){
        res.status(500).json({message: 'Erro ao atualizar tarefa'})
    }
})

export default tasksRouter;