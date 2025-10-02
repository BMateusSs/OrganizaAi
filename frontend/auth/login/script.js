import { methodPost } from "../../utils/methods.js"
import useFetch from "../../utils/fetch.js"

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form')
    const credential = document.getElementById('credentials')
    const password = document.getElementById('password')
    let errorMessage = document.querySelector('.error-message')

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        errorMessage.textContent=''

        if(!credential.value || !password.value){
            errorMessage.textContent='Preencha todos os dados'
            return
        }

        const url = 'http://localhost:3000/login'
        const body = {
            credential: credential.value,
            password: password.value
        }

        const config = methodPost(body)

        const {data, error} = await useFetch(url, config)

        if (error){
            errorMessage.textContent=error
            return
        }

        const token = data.token
        localStorage.setItem('token', token)

    })

})