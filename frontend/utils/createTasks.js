import { methodPost, methodGet, methodPut } from './methods.js'
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

export async function readProjectTasks(proj_id) {
    const body = {proj_id: proj_id}
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

export async function updateTask(taskId, updates) {
    const body = {
        taskId: taskId,
        updates: updates
    }

    const config = methodPut(body)
    const url = "http://localhost:3000/tasks/update_task"

    const {data, error} = await useFetch(url, config)

    if (error) {
        console.log(error)
        return
    }

    console.log('Tarefa atualizada com sucesso!')
    return data
}

export async function readCompletedTasks() {
    const config = methodGet()
    const url = "http://localhost:3000/tasks/completed_tasks"

    const {data, error} = await useFetch(url, config)

    if (error){
        console.log(error)
        return
    }

    return data
}

export async function deleteTask(taskId) {
    const body = {
        taskId: taskId,
    }

    const config = methodPost(body)
    const url = "http://localhost:3000/tasks/delete_task"

    const {data, error} = await useFetch(url, config)

    if (error) {
        console.log(error)
        return
    }

    console.log('Tarefa deletada com sucesso!')
    return data
}
