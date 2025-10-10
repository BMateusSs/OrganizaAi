import { projectFormModal } from "../../../utils/projectFormModal.js"

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('projects')
    const addProjectButton = document.createElement('button')
    addProjectButton.textContent='Adicionar projeto'
    content.appendChild(addProjectButton)

    addProjectButton.addEventListener('click', async () => {
        await projectFormModal(content)
    })


})