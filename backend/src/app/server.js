import express from 'express';
import router from '../rotas/public.js';
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(cors())

app.use(router)

app.listen(3000, () => {
    console.log("Rodando o servidor na porta 3000")
})