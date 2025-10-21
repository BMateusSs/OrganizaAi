import { Router } from 'express';
import { createHabit } from '../database/querys/habits/habits.js';
import { validateToken } from '../utils/auth.js'

const habitRouter = Router();

habitRouter.post('/create', validateToken, async (req, res) => {
   
    const userId = req.userId; 
    const habitInfo = req.body;
    
    if (!habitInfo.title || !habitInfo.recurrence) {
        return res.status(400).json({ message: 'Título e recorrência são obrigatórios.' });
    }

    try {
        const habitId = await createHabit(userId, habitInfo);

        return res.status(201).json({ 
            message: 'Modelo de Hábito criado com sucesso.', 
            habitId: habitId 
        });

    } catch (error) {
        console.error("Erro ao criar modelo de hábito:", error);
        return res.status(500).json({ message: 'Erro interno ao criar o hábito.' });
    }
});

export default habitRouter;