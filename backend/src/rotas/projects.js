import { Router } from 'express';
import { createProject, readProject, allProjects } from '../database/querys/projects/projects.js'
import { validateToken } from '../utils/auth.js'

const projectRouter = Router()

projectRouter.post('/create_project', validateToken, async (req, res) => {
    try{
        const userId = req.userId
        const infos = req.body

        const projectId = await createProject(userId, infos)

        return res.status(201).json({'message': 'Projeto criado com sucesso', 'projectId': projectId})

    }catch(error){
        return res.status(500).json({'message': 'Erro ao criar projeto'})
    }
})

projectRouter.get('/read_projects', validateToken, async (req, res) => {
    try{
        const userId = req.userId

        const projects = await readProject(userId)

        return res.status(200).json({projects})
        
    }catch(error){
        return res.status(500).json({'message': 'Erro ao buscar projetos'})
    }
})

projectRouter.get('all_projects', validateToken, async (req, res) => {
    try{
        const userId = req.userId

        projects = await allProjects(userId)

        return res.status(200).json({projects})

    }catch(error){
        return res.status(500).json({message: "Erro ao buscar nome dos projetos"})
    }
    

})

export default projectRouter
