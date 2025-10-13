import { projectFormModal } from "../../../utils/projectFormModal.js"
import { readProject } from "../../../utils/fetchProjects.js"
import { formatDate } from "../../../utils/formatDates.js"
import { readProjectTasks } from "../../../utils/createTasks.js"
import { taskFormModal } from "../../../utils/taskFormModal.js"

document.addEventListener('DOMContentLoaded', async () => {
    const content = document.getElementById('projects')

    const projectList = document.createElement('div')

    const projectHeader = document.createElement('div')
    const searchBar = document.createElement('input')
    const addProjectButton = document.createElement('button')
    
    addProjectButton.textContent='Adicionar projeto'
    
    projectHeader.appendChild(searchBar)
    projectHeader.appendChild(addProjectButton)
    projectList.appendChild(projectHeader)

    projectList.classList.add('project-list')
    content.appendChild(projectList)

    async function renderProjects(){
        projectList.innerHTML=``

        const data = await readProject()
        const projects = await data.projects

        projects.forEach(project => {
            const date = project.created_at
            const createdDate = formatDate(date)
            const card = document.createElement('div')
            card.classList.add("card-project")
            card.innerHTML=`
            
                <div class="header-project ">
                </div>
                <div class="infos-project">
                    <span class="raleway-regular">${project.name}</span>
                    <div class="raleway-thin date-container">${createdDate}</div>
                </div>
            `
            projectList.appendChild(card)
            const colorHeader = card.querySelector('.header-project')
            colorHeader.style.backgroundColor = project.code

            card.addEventListener('click', async () => {
                await showProjectList(content, project.id, project.name, project.layout_type, project.color)
            })
            
        });
    }

    await renderProjects()

    addProjectButton.addEventListener('click', async () => {
        await projectFormModal(content, renderProjects)
    })

})

async function showProjectList(content, id, name, layout, color){
    content.innerHTML=``
    const taskList = document.createElement('div')
    taskList.classList.add('project-list')

    const title = document.createElement('h1')
    title.textContent = name
    content.appendChild(title)

    const addTask = document.createElement('button')
    addTask.textContent = '+ Adicionar tarefa'
    addTask.classList.add('create-button', 'raleway-bold');

    content.appendChild(taskList)
    content.appendChild(addTask)

    async function renderTasks() {
            taskList.innerHTML = '';
        
            const data = await readProjectTasks(id);
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

    addTask.addEventListener('click', async() => {
        taskFormModal(content)
    })
        
}