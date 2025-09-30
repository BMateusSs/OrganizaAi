import { methodPost } from "../../utils/methods.js"
import useFetch from "../../utils/fetch.js"

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const name = document.getElementById('name')
    const username = document.getElementById('username')
    const password = document.getElementById('password')
    const repeatPassword = document.getElementById('repeat-password')
    const email = document.getElementById('email')
    const errorMessage = document.querySelector('.error-message')
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        errorMessage.textContent=""

        if (password.value !== repeatPassword.value){
            errorMessage.textContent='A senhas não são iguais'
            return
        }

        if (!name.value || !username.value || !password.value || !repeatPassword.value || !email.value){
            errorMessage.textContent='Preencha todos os campos'
            return
        }

        const url = 'http://localhost:3000/register'

        const body = {
            name: name.value,
            username: username.value,
            email: email.value, 
            password: password.value,
        }

        const config = methodPost(body)

        const {data, error} = await useFetch(url, config)

        if (error){
            errorMessage.textContent=error
        }

    })
})