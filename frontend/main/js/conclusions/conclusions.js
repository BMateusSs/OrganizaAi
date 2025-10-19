import { readCompletedTasks } from "../../../utils/createTasks.js"

document.addEventListener('DOMContentLoaded', async () => {
    const conclusionsContainer = document.getElementById('check')
    conclusionsContainer.innerHTML="TAREFAS CONCLUÍDAS"

    const completedTasks = await readCompletedTasks()

    for (const [date, tasks] of Object.entries(completedTasks)){
        const section = document.createElement('div')
        const title = document.createElement('h1')
        title.textContent=date
        section.appendChild(title)

        tasks.forEach(task => {

            const description = task.description ? task.description : ''
            const project = task.name ? task.name : 'Aleatórias'
            
            const cardTask = document.createElement('div')
            cardTask.classList.add('task-card')
            
            cardTask.innerHTML=`
            <div class="check-container">
              <button class="check-button"></button>
            </div>
            <div class="content-task-container">
              <h3 class="raleway-thin">${task.title}</h3>
              <p class="raleway-thin">${description}</p>
              <div class="info-task-container">
                <div class="project-container raleway-thin">
                  <i class="fa-solid fa-box-archive"></i>
                  <span>${project}</span>
                </div>
              </div>
            </div>
          `;
            
            conclusionsContainer.appendChild(section)
            
            section.appendChild(cardTask)

            const containerCheck = cardTask.querySelector('.check-container')
            containerCheck.style.backgroundColor = task.code

            const checkBtn = cardTask.querySelector('.check-button')
            checkBtn.classList.add('checked')
            checkBtn.style.backgroundColor = task.code
        });
    }
})