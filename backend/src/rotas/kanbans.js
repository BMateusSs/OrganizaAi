import { Router } from 'express';
import { validateToken } from '../utils/auth.js'
import { createColumn, updateColumnId } from '../database/querys/kanbans/kanbans.js';

const kanbansRouter = Router()

kanbansRouter.post('/create_column', validateToken, async (req, res) => {
    try{
        const userId = req.userId
        const projId = req.body.projId
        const name = req.body.name
        const order = req.body.order

        const taskId = await createColumn(userId, projId, name, order)

        return res.status(200).json({message: 'Tarefa atualizada com sucesso', taskId: taskId})
    }catch(error){
        return res.status(500).json({message: 'Erro ao criar coluna', error: error})
    }
})

kanbansRouter.post('/update_task_column', validateToken, async (req, res) => {
    try{
        const userId = req.userId
        const taskId = req.body.taskId
        const columnId = req.body.columnId
        
        const affectedRow = await updateColumnId(userId, taskId, columnId)

        return res.status(200).json({message: 'Tarefa atualizada com sucesso'})

    }catch(error){
        return res.status(500).json({message: 'Erro ao tentar atualizar tarefa'})
    }
})

export default kanbansRouter