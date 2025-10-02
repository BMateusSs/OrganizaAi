import { Router } from 'express';
import { createTask } from '../database/querys/tasks/tasks.js';

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

export default tasksRouter;