import useFetch from "./fetch.js";
import { methodPost, methodGet } from "./methods.js";

export async function createProject(name, color, layout){
    const body = {
        name: name,
        color: color,
        layout: layout
    }

    const config = methodPost(body)

    const url = 'http://localhost:3000/projects/create_project'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    console.log(data.message)
}

export async function readProject(){

    const config = methodGet()

    const url = 'http://localhost:3000/projects/read_projects'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    return data
}

export async function projectsName(){

    const config = methodGet()

    const url = 'http://localhost:3000/projects/all_projects'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    return data
}

export async function projectColumns(projId){
    const body = {
        projId: projId
    }

    const config = methodPost(body)

    const url = 'http://localhost:3000/projects/project_columns'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    return data
}

export async function deleteProject(projId){
    const body = {
        projId: projId
    }

    const config = methodPost(body)

    const url = 'http://localhost:3000/projects/delete_project'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    return data
}