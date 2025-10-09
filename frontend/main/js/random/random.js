import { readProjectTasks, updateTaskStatus } from "../../../utils/createTasks.js";
import { taskFormModal } from "../../../utils/taskFormModal.js";

document.addEventListener('DOMContentLoaded', async () => {
    const content = document.getElementById('random')
    const taskList = document.createElement('div')
    taskList.classList.add('today-list');

    content.appendChild(taskList)

    const button = document.createElement('button');
    button.textContent = '+ Adicionar tarefa';
    button.classList.add('create-button', 'raleway-bold');

    content.appendChild(button)

    async function renderTasks() {
        taskList.innerHTML = '';
    
        const data = await readProjectTasks(null);
        const tasks = await data.tasks;
    
        tasks.forEach(task => {
          const card = document.createElement('div');
          card.classList.add('task-card');
    
          const description = task.description || '';
          const project = task.project_id || 'Aleatórias';
    
          card.innerHTML = `
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
    
          const buttonCheck = card.querySelector('.check-button');
          buttonCheck.addEventListener('click', async () => {
            buttonCheck.classList.toggle('checked');
            const taskId = task.id
            await updateTaskStatus(taskId)
    
            await renderTasks()
        
          });
    
          taskList.appendChild(card);
        });
      }
    
    await renderTasks();
    
    button.addEventListener('click', async () => {
        await taskFormModal(content, {defaultProject: 'aleatoria', onTaskCreated: renderTasks})
    })

})