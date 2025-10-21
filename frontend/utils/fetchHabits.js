import useFetch from "./fetch.js";
import { methodPost, methodGet } from "./methods.js";

export async function createHabit(habitInfos){
  
    const config = methodPost(habitInfos)

    const url = 'http://localhost:3000/projects/project_columns'

    const {data, error} = await useFetch(url, config)

    if (error){
        alert(error)
    }

    return data
}