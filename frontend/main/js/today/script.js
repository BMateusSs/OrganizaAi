import { createTask } from "../../../utils/createTasks.js";

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('today');

    const todayList = document.createElement('div')
    todayList.classList.add('today-list')
    const button = document.createElement('button')
    button.textContent = 'CRIAR'
    content.appendChild(todayList)
    content.appendChild(button)

    const taskModal = document.createElement('div') 
    taskModal.classList.add("modal-overlay")


    const tasks = [
        {title: 'Estudar para a prova'},
        {title: 'Finalizar projeto Organiza-Aí'},
        {title: 'Treinar dicção'}
    ];

    tasks.forEach(task => {
        const card = document.createElement('div')
        card.classList.add('task-card')
        card.innerHTML=`
            <input type="checkbox"/>
            <h3 class="raleway-regular">${task.title}</h3>
        `
        todayList.appendChild(card)
    });

    button.addEventListener('click', () => {
        

        content.appendChild(taskModal)

        const taskForm = document.createElement('div')
        taskForm.classList.add('modal-content')

        taskForm.innerHTML=`
        <h2 class="modal-title raleway-bold">Criar Nova Tarefa</h2>
        <div>
            <label class="raleway-regular">Título da tarefa</label>
            <input type="text" id="title" placeholder="Ex: Estudar para a prova"/>
        </div>
        <div>
            <label class="raleway-regular">Descrição</label>
            <textarea id="description" name="descricao" rows="4" class="raleway-thin" placeholder="Detalhes, notas ou links úteis sobre a tarefa..."></textarea>
        </div>
        <div class="additionals-infos raleway-regular">
            <select>
                <option selected value="aleatoria" class="raleway-regular">Aleatórias</option>
                <option value="Organiza-Aí" class="raleway-regular">Organiza-Aí</option>
                <option value="javascript" class="raleway-regular">Curso JavaScript</option>
            </select>
            <input type="date" id="due-date" class="raleway-thin"/>
        </div>
        <div class="buttons-container">
            <button class="button cancel-button raleway-regular">Cancelar</button>
            <button class="button confirm-button raleway-regular">Adicionar Tarefa</button>
        </div>
        `

        taskModal.appendChild(taskForm)

        const confirmButton = document.querySelector('.confirm-button') 
        confirmButton.addEventListener('click', () => {

            const user_id = 8
            const title = document.getElementById('title').value || null
            const description = document.getElementById('description').value || null
            const project_id = null
            const collumn_id = null
            const is_habit = false
            const recurrence = null
            const due_date = document.getElementById('due-date').value || null
            
            const task_info = {
                user_id: user_id,
                title: title,
                description: description,
                project_id: project_id,
                collumn_id: collumn_id,
                is_habit: is_habit,
                recurrence: recurrence,
                due_date: due_date
            }

            content.removeChild(taskModal)
            taskModal.removeChild(taskForm)
            createTask(task_info)
            
        })

        const cancelButton = document.querySelector('.cancel-button') 
        cancelButton.addEventListener('click', () => {
            content.removeChild(taskModal)
            taskModal.removeChild(taskForm)
        })

        taskModal.addEventListener('click', (event) => {
            if (event.target === taskModal){
                content.removeChild(taskModal)
                taskModal.removeChild(taskForm)
            }
        })
    })
})