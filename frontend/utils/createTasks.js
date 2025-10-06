import { methodPost } from './methods.js'
import useFetch from './fetch.js'

export async function createTask(task_infos){
    const body = task_infos
    const config = methodPost(body)
    const url = "http://localhost:3000/tasks/create_task"

    const {data, error} = useFetch(url, config)

    if (error){
        console.log(error)
        return
    }

    console.log('Tarefa criada com sucesso!')
}