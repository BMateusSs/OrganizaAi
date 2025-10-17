import { projectFormModal } from "../../../utils/projectFormModal.js"
import { readProject, projectColumns } from "../../../utils/fetchProjects.js"
import { formatDate } from "../../../utils/formatDates.js"
import { readProjectTasks, updateTaskStatus } from "../../../utils/createTasks.js"
import { taskFormModal } from "../../../utils/taskFormModal.js"
import { updateColumnId, createColumn } from "../../../utils/fetchKanbans.js"

document.addEventListener('DOMContentLoaded', async () => {
    const content = document.getElementById('projects')

    const projectList = document.createElement('div')
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
              if (project.layout_type === 'LIST'){
                await showProjectList(content, project.id, project.name, project.layout_type, project.color, project.code)
              }else {
                await showProjectKanban(content, project.id, project.name, project.layout_type, project.color, project.code)
              }

            })
            
        });
    }

    await renderProjects()

    // Adicionar event listener ao botão do HTML
    const addProjectButton = content.querySelector('button')
    addProjectButton.addEventListener('click', async () => {
        await projectFormModal(content, renderProjects)
    })

})

async function showProjectList(content, id, name, layout, color, code){
    content.innerHTML=``
    const taskList = document.createElement('div')
    taskList.classList.add('today-list');

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
              card.querySelector(".check-container").style.backgroundColor = code
              const buttonCheck = card.querySelector('.check-button');
              buttonCheck.style.backgroundColor = code
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
        const options = {
                defaultProject: id,
                onTaskCreated: renderTasks
              } 
        taskFormModal(content, options)
    })
        
}

async function showProjectKanban(content, id, name, layout, color, code) {
  content.innerHTML = ''

  const kanbanList = document.createElement('div')
  kanbanList.classList.add('container-kanbans')

  const title = document.createElement('h1')
  title.textContent = name
  content.appendChild(title)
  content.appendChild(kanbanList)

  const addColumn = document.createElement('button')
  addColumn.innerHTML = '+ Adicionar lista'
  addColumn.classList.add('add-kanban')
 

  // Renderiza colunas existentes
  const data = await projectColumns(id)
  const columns = data.columns

  columns.forEach(column => {
    const card = document.createElement('div')

    card.innerHTML = `
      <div class="kanban-header">
        <span class="raleway-regular">${column.name}</span>
        <button class="kanban-options">...</button>
      </div>
      <div class="kanban-content" id="${column.id}"></div>
    `
    card.classList.add('kanban-column')
    kanbanList.appendChild(card)
  })

  // Renderiza tarefas
  const dataTask = await readProjectTasks(id)
  const tasks = await dataTask.tasks

  tasks.forEach(task => {
    const cardTask = document.createElement('div')
    cardTask.classList.add('test-card')
    cardTask.draggable = true
    cardTask.innerHTML = `<p>${task.title}</p>`
    cardTask.id = task.id

    const targetColumn = document.getElementById(task.column_id)
    if (targetColumn) targetColumn.appendChild(cardTask)
  })

  // Funções de drag and drop
  let draggedCard
  const columnsKanbans = kanbanList.querySelectorAll('.kanban-content')
  const cards = kanbanList.querySelectorAll('.test-card')

  cards.forEach(card => {
    card.addEventListener('dragstart', (event) => {
      draggedCard = event.target
    })
  })

  columnsKanbans.forEach(column => {
    column.addEventListener('dragover', (event) => event.preventDefault())

    column.addEventListener('dragenter', ({ target }) => {
      if (target.classList.contains('kanban-content')) target.classList.add('enter')
    })

    column.addEventListener('dragleave', () => column.classList.remove('enter'))

    column.addEventListener('drop', async ({ target }) => {
      if (target.classList.contains('kanban-content')) {
        column.appendChild(draggedCard)
        column.classList.remove('enter')
        await updateColumnId(draggedCard.id, column.id)
      }
    })
  })

  kanbanList.appendChild(addColumn)

  // --- Comportamento do botão "Adicionar lista" ---
  addColumn.addEventListener('click', () => {
    addColumn.remove()

    const formWrapper = document.createElement('div')
    formWrapper.id = 'addColumnForm'
    formWrapper.classList.add('add-column-container')

    formWrapper.innerHTML = `
      <div>
        <input type="text" id="columnNameInput" placeholder="Nomear esta seção" class="input-column"/>
      </div>
      <div class="buttons">
        <button class="confirm-column">Adicionar seção</button>
        <button class="cancel-column">Cancelar</button>
      </div>
    `

    kanbanList.appendChild(formWrapper)

    // Botão "Adicionar"
    formWrapper.querySelector('.confirm-column').addEventListener('click', async () => {
      const input = formWrapper.querySelector('#columnNameInput')
      const columnName = input.value.trim()

      if (!columnName) return alert('Digite um nome para a seção!')

      const order = columnsKanbans.length + 1
      console.log(order)

      await createColumn(id, columnName, order)
      await showProjectKanban(content, id, name, layout, color, code)
    })

    // Botão "Cancelar"
    formWrapper.querySelector('.cancel-column').addEventListener('click', () => {
      formWrapper.remove()
      kanbanList.appendChild(addColumn)
    })



  })
}

