import express from 'express';
import router from '../rotas/public.js';

const app = express();

app.use(express.json())

app.use(router)

app.listen(3000, () => {
    console.log("Rodando o servidor na porta 3000")
})