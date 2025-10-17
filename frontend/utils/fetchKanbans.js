import useFetch from "./fetch.js";
import { methodPost, methodGet } from "./methods.js";

export async function updateColumnId(taskId, columnId){
    const body = {
        taskId: taskId,
        columnId: columnId
    }

    const config = methodPost(body)

    const url = 'http://localhost:3000/kanbans/update_task_column'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    console.log(data.message)
}

export async function createColumn(projId, name, order){
    const body = {
        projId: projId,
        name: name,
        order: order
    }

    const config = methodPost(body)

    const url = 'http://localhost:3000/kanbans/create_column'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    console.log(data.message)
}