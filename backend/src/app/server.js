import express from 'express';
import router from '../rotas/public.js';
import tasksRouter from '../rotas/tasks.js';
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(cors())

app.use(router)
app.use('/tasks', tasksRouter)

app.listen(3000, () => {
    console.log("Rodando o servidor na porta 3000")
})