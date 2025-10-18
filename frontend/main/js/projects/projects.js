import { projectFormModal } from "../../../utils/projectFormModal.js"
import { readProject, projectColumns } from "../../../utils/fetchProjects.js"
import { formatDate } from "../../../utils/formatDates.js"
import { createTask, readProjectTasks, updateTaskStatus, updateTask } from "../../../utils/createTasks.js"
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
  content.innerHTML = '';

  const kanbanList = document.createElement('div');
  kanbanList.classList.add('container-kanbans');

  const title = document.createElement('h1');
  title.textContent = name;
  content.appendChild(title);
  content.appendChild(kanbanList);

  const addColumn = document.createElement('button');
  addColumn.innerHTML = '+ Adicionar lista';
  addColumn.classList.add('add-kanban');

  // Renderiza colunas existentes
  const data = await projectColumns(id);
  const columns = data.columns;

  columns.forEach(column => {
    const card = document.createElement('div');

    card.innerHTML = `
      <div class="kanban-header">
        <span class="raleway-regular">${column.name}</span>
        <button class="kanban-options">...</button>
      </div>
      <div class="kanban-content" id="${column.id}"></div>
    `;
    card.classList.add('kanban-column');
    kanbanList.appendChild(card);
  });

  // Renderiza tarefas
  const dataTask = await readProjectTasks(id);
  const tasks = await dataTask.tasks;

  tasks.forEach(task => {
    const cardTask = document.createElement('div');
    cardTask.classList.add('kanban-task-card', 'raleway-thin');
    cardTask.draggable = true;
    cardTask.innerHTML = `<button class="check-button"></button>
                          <p>${task.title}</p>`;
    cardTask.id = task.id;

    const checkBtn = cardTask.querySelector('.check-button')
    checkBtn.style.backgroundColor = 'transparent'

    // Adicionar duplo clique para editar
    cardTask.addEventListener('dblclick', () => {
      const targetColumn = document.getElementById(task.column_id);
      editTaskInKanban(cardTask, task, targetColumn);
    });

    const targetColumn = document.getElementById(task.column_id);
    if (targetColumn) targetColumn.appendChild(cardTask);
  });

  // Funções de drag and drop
  let draggedCard;
  let placeholderTask;
  const columnsKanbans = kanbanList.querySelectorAll('.kanban-content');
  const cards = kanbanList.querySelectorAll('.kanban-task-card');

  let addTaskButtons = [];

  cards.forEach(card => {
    card.addEventListener('dragstart', (event) => {
      draggedCard = event.target;

      placeholderTask = document.createElement('div');
      placeholderTask.classList.add('placeholderTask');
      placeholderTask.style.width = '100%';
      placeholderTask.style.height = draggedCard.offsetHeight + 'px';
      placeholderTask.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
      placeholderTask.style.borderRadius = '10px';

      // Esconde todos os botões de adicionar tarefa
      addTaskButtons.forEach(btn => btn.style.display = 'none');
    });

    card.addEventListener('dragend', () => {
      // Mostra novamente os botões após o fim do drag
      addTaskButtons.forEach(btn => btn.style.display = 'block');
    });
  });

  columnsKanbans.forEach(column => {
    column.addEventListener('dragover', (event) => event.preventDefault());

    column.addEventListener('dragenter', ({ target }) => {
      if (target.classList.contains('kanban-content')) {
        column.insertBefore(placeholderTask, addTaskBtn);
      }
    });


    column.addEventListener('drop', async ({ target }) => {
      if (target.classList.contains('kanban-content') || target.classList.contains('placeholderTask')) {
        column.insertBefore(draggedCard, addTaskBtn);
        placeholderTask.remove();

        // Garante que o botão de adicionar tarefa seja o último item da coluna
        column.appendChild(addTaskBtn);

        // Mostra novamente todos os botões
        addTaskButtons.forEach(btn => btn.style.display = 'block');

        await updateColumnId(draggedCard.id, column.id);
      }
    });

    // Botão de adicionar tarefa
    const addTaskBtn = document.createElement('button');
    addTaskBtn.textContent = '+ Adicionar tarefa';
    column.appendChild(addTaskBtn);
    addTaskButtons.push(addTaskBtn);

    addTaskBtn.addEventListener('click', () => {
      addTaskBtn.remove();

      const taskKanbanForm = document.createElement('div');
      taskKanbanForm.innerHTML = `
        <input type="text" id="kanban-task-name" placeholder="Nome da tarefa" class="raleway-thin"/>
        <input type="date" id="kanban-task-duedate" class="raleway-thin"/>
        <div>
          <button>X</button>
          <button class="create-kanaban-task"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      `;

      column.appendChild(taskKanbanForm);

      column.querySelector('.create-kanaban-task').addEventListener('click', async () => {
        const user_id = 8;
        const title = taskKanbanForm.querySelector('#kanban-task-name').value || null;
        const description = null;
        const project_id = id || null;
        const column_id = column.id;
        const is_habit = false;
        const recurrence = null;
        const due_date = taskKanbanForm.querySelector('#kanban-task-duedate').value || null;

        const task_info = {
          user_id,
          title,
          description,
          project_id,
          column_id,
          is_habit,
          recurrence,
          due_date
        };

        await createTask(task_info);
        taskKanbanForm.remove();
        await showProjectKanban(content, id, name, layout, color, code);
      });
    });
  });

  kanbanList.appendChild(addColumn);

  // Botão "Adicionar lista"
  addColumn.addEventListener('click', () => {
    addColumn.remove();

    const formWrapper = document.createElement('div');
    formWrapper.id = 'addColumnForm';
    formWrapper.classList.add('add-column-container');

    formWrapper.innerHTML = `
      <div>
        <input type="text" id="columnNameInput" placeholder="Nomear esta seção" class="input-column"/>
      </div>
      <div class="buttons">
        <button class="confirm-column">Adicionar seção</button>
        <button class="cancel-column">Cancelar</button>
      </div>
    `;

    kanbanList.appendChild(formWrapper);

    formWrapper.querySelector('.confirm-column').addEventListener('click', async () => {
      const input = formWrapper.querySelector('#columnNameInput');
      const columnName = input.value.trim();

      if (!columnName) return alert('Digite um nome para a seção!');

      const order = columnsKanbans.length + 1;
      await createColumn(id, columnName, order);
      await showProjectKanban(content, id, name, layout, color, code);
    });

    formWrapper.querySelector('.cancel-column').addEventListener('click', () => {
      formWrapper.remove();
      kanbanList.appendChild(addColumn);
    });
  });
}

// Função para editar tarefa no kanban
async function editTaskInKanban(cardElement, task, column) {
  // Substituir o card pelo formulário de edição
  const editForm = document.createElement('div');
  editForm.classList.add('kanban-edit-form');
  
  editForm.innerHTML = `
    <input type="text" id="edit-task-title" value="${task.title}" placeholder="Nome da tarefa" class="raleway-thin"/>
    <input type="date" id="edit-task-duedate" value="${task.due_date || ''}" class="raleway-thin"/>
    <div class="edit-buttons">
      <button class="cancel-edit">X</button>
      <button class="save-edit"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
  `;

  // Substituir o card pelo formulário
  column.insertBefore(editForm, cardElement);
  cardElement.style.display = 'none';

  // Event listeners para os botões
  editForm.querySelector('.cancel-edit').addEventListener('click', () => {
    editForm.remove();
    cardElement.style.display = 'flex';
  });

  editForm.querySelector('.save-edit').addEventListener('click', async () => {
    const newTitle = editForm.querySelector('#edit-task-title').value.trim();
    const newDueDate = editForm.querySelector('#edit-task-duedate').value;

    if (!newTitle) {
      alert('O título da tarefa não pode estar vazio!');
      return;
    }

    // Preparar atualizações
    const updates = {
      title: newTitle,
      due_date: newDueDate || null
    };

    try {
      // Atualizar no backend
      await updateTask(task.id, updates);
      
      // Atualizar o texto no card
      const titleElement = cardElement.querySelector('p');
      titleElement.textContent = newTitle;
      
      // Remover formulário e mostrar card atualizado
      editForm.remove();
      cardElement.style.display = 'flex';
      
      console.log('Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      alert('Erro ao atualizar tarefa. Tente novamente.');
    }
  });
}
