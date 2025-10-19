import { Router } from 'express';
import { createTask, readTask, checkCompleted, readProjectTasks, updateTask, completedTasks, deleteTask } from '../database/querys/tasks/tasks.js';
import { validateToken } from '../utils/auth.js';

const tasksRouter = Router(); 

tasksRouter.post('/create_task', async (req, res) => {
    const task_infos = req.body;
    
    try {
        console.log(task_infos)
        const taskId = await createTask(task_infos);

        return res.status(201).json({
            message: "Tarefa criada com sucesso.",
            id: taskId 
        });

    } catch (error) {
        console.error("Erro ao criar tarefa:", error); 
        
        return res.status(500).json({ 
            message: error, 
        });
    }
});

tasksRouter.get('/read_task', validateToken, async (req, res) => {
    try {
        const user_id = req.userId
        const tasks = await readTask(user_id)

        res.status(200).json({tasks})

    }catch (error){
        res.status(500).json({message: "Erro ao buscar tarefas"})
    }
})

tasksRouter.post('/read_project_tasks', validateToken, async (req, res) => {
    try {
        const user_id = req.userId
        const proj_id = req.body.proj_id
        const tasks = await readProjectTasks(user_id, proj_id)
        console.log("tarefas: ", tasks)

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

tasksRouter.put('/update_task', validateToken, async (req, res) => {
    try {
        const userId = req.userId
        const taskId = req.body.taskId
        const updates = req.body.updates

        const rowUpdate = await updateTask(userId, taskId, updates)

        return res.status(200).json({
            message: 'Tarefa atualizada com sucesso!', 
            rows: rowUpdate
        })
        
    } catch(error) {
        console.error("Erro ao atualizar tarefa:", error)
        res.status(500).json({message: 'Erro ao atualizar tarefa'})
    }
})

tasksRouter.get('/completed_tasks', validateToken, async (req, res) => {
    try{
        const userId = req.userId;
        const tasks = await completedTasks(userId)

        return res.status(200).json(tasks)

    }catch(error){
        return res.status(500).json({message: "Erro ao buscar tarefas completadas", error: error})
    }
})

tasksRouter.post('/delete_task', validateToken, async (req, res) => {
    try{
        const userId = req.userId;
        const taskId = req.body.taskId
        const affectedRows = await deleteTask(userId, taskId)

        return res.status(200).json({message: "Tarefa deletada", rows: affectedRows})

    }catch(error){
        return res.status(500).json({message: "Erro ao deletar tarefa", error: error})
    }
})

export default tasksRouter;