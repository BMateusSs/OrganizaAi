import { Router } from 'express';
import { createProject, readProject, allProjects, projectColumns, deleteProject } from '../database/querys/projects/projects.js'
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

projectRouter.get('/all_projects', validateToken, async (req, res) => {
    try{
        const userId = req.userId

        const projects = await allProjects(userId)

        return res.status(200).json({projects})

    }catch(error){
        return res.status(500).json({message: "Erro ao buscar nome dos projetos"})
    }
    

})

projectRouter.post('/project_columns', validateToken, async (req, res) => {

    try {
        const userId = req.userId
        const projId = req.body.projId

        const columns = await projectColumns(userId, projId)

        return res.status(200).json({columns})
        
    }catch(error){
        return res.status(500).json({message: "Erro ao buscar colunas"})
    }
})

projectRouter.post('/delete_project', validateToken, async (req, res) => {

    try {
        const userId = req.userId
        const projId = req.body.projId

        const affectedRows = await deleteProject(projId)

        return res.status(200).json({message: 'Projeto deletado com sucesso', rows: affectedRows})
        
    }catch(error){
        return res.status(500).json({message: "Erro ao deletar projeto"})
    }
})

export default projectRouter
