import { createTask, readTask, updateTaskStatus, updateTask } from "../../../utils/createTasks.js";
import { getTodayDate } from "../../../utils/formatDates.js";
import { taskFormModal } from "../../../utils/taskFormModal.js";


document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('today');
  const todayList = document.createElement('div');
  todayList.classList.add('today-list');

  const button = document.createElement('button');
  button.textContent = '+ Adicionar tarefa';
  button.classList.add('create-button', 'raleway-bold');

  content.appendChild(todayList);
  content.appendChild(button);

  async function renderTasks() {
    todayList.innerHTML = '';

    const data = await readTask();
    const tasks = await data.tasks;

    tasks.forEach(task => {
      const card = document.createElement('div');
      card.classList.add('task-card');

      const description = task.description || '';
      const project = task.name || 'Aleatórias';

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

      const check = card.querySelector('.check-container')
      check.style.backgroundColor = task.code

      const checkBtn = card.querySelector('.check-button')
      checkBtn.style.backgroundColor = task.code

      const contentBorde = card.querySelector('.content-task-container')
      contentBorde.style.borderColor = task.code

      // Adicionar duplo clique para editar
      card.addEventListener('dblclick', () => {
        editTaskInList(card, task, todayList);
      });

      todayList.appendChild(card);

    });
  }

  await renderTasks();

  button.addEventListener('click', async () => {
    const defaultDate = getTodayDate()
    await taskFormModal(content, {defaultProject: 'javascript', defaultDate: defaultDate, onTaskCreated: renderTasks})

  });
  
});

// Função para editar tarefa em lista
async function editTaskInList(cardElement, task, container) {
  // Substituir o card pelo formulário de edição
  const editForm = document.createElement('div');
  editForm.classList.add('list-edit-form');
  
  editForm.innerHTML = `
    <div class="edit-form-content">
      <input type="text" id="edit-task-title" value="${task.title}" placeholder="Título da tarefa" class="raleway-thin"/>
      <textarea id="edit-task-description" placeholder="Descrição..." class="raleway-thin">${task.description || ''}</textarea>
      <input type="date" id="edit-task-duedate" value="${task.due_date || ''}" class="raleway-thin"/>
      <div class="edit-buttons">
        <button class="cancel-edit">Cancelar</button>
        <button class="save-edit">Salvar</button>
      </div>
    </div>
  `;

  // Substituir o card pelo formulário
  container.insertBefore(editForm, cardElement);
  cardElement.style.display = 'none';

  // Event listeners para os botões
  editForm.querySelector('.cancel-edit').addEventListener('click', () => {
    editForm.remove();
    cardElement.style.display = 'flex';
  });

  editForm.querySelector('.save-edit').addEventListener('click', async () => {
    const newTitle = editForm.querySelector('#edit-task-title').value.trim();
    const newDescription = editForm.querySelector('#edit-task-description').value.trim();
    const newDueDate = editForm.querySelector('#edit-task-duedate').value;

    if (!newTitle) {
      alert('O título da tarefa não pode estar vazio!');
      return;
    }

    // Preparar atualizações
    const updates = {
      title: newTitle,
      description: newDescription || null,
      due_date: newDueDate || null
    };

    try {
      // Atualizar no backend
      await updateTask(task.id, updates);
      
      // Atualizar o conteúdo no card
      const titleElement = cardElement.querySelector('h3');
      const descriptionElement = cardElement.querySelector('p');
      titleElement.textContent = newTitle;
      descriptionElement.textContent = newDescription || '';
      
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
