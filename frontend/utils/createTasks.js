import { methodPost, methodGet } from './methods.js'
import useFetch from './fetch.js'

export async function createTask(task_infos){
    const body = task_infos
    const config = methodPost(body)
    const url = "http://localhost:3000/tasks/create_task"

    const {data, error} = await useFetch(url, config)

    if (error){
        console.log(error)
        return
    }

    console.log('Tarefa criada com sucesso!')
}

export async function readTask() {
    const config = methodGet()
    const url = "http://localhost:3000/tasks/read_task"

    const {data, error} = await useFetch(url, config)

    if (error){
        console.log(error)
        return
    }

    return data
}

export async function readProjectTasks(project) {
    const body = {project: project}
    const config = methodPost(body)
    const url = "http://localhost:3000/tasks/read_project_tasks"

    const {data, error} = await useFetch(url, config)

    if (error){
        console.log(error)
        return
    }

    return data
}

export async function updateTaskStatus(taskId){
    const body = {
        taskId: taskId,
        isCompleted: true
    }

    const config = methodPost(body)

    const url = 'http://localhost:3000/tasks/complete_task'

    const {data, error} = await useFetch(url, config)
}