import { createTask, readTask } from "../../../utils/createTasks.js";

document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('today');
  const todayList = document.createElement('div');
  todayList.classList.add('today-list');

  const button = document.createElement('button');
  button.textContent = '+ Adicionar tarefa';
  button.classList.add('create-button', 'raleway-bold');

  content.appendChild(todayList);
  content.appendChild(button);

  const taskModal = document.createElement('div');
  taskModal.classList.add("modal-overlay");


  async function renderTasks() {
    todayList.innerHTML = '';

    const data = await readTask();
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
      buttonCheck.addEventListener('click', () => {
        buttonCheck.classList.toggle('checked');
    
      });

      todayList.appendChild(card);
    });
  }

  await renderTasks();

  button.addEventListener('click', () => {
    content.appendChild(taskModal);

    const taskForm = document.createElement('div');
    taskForm.classList.add('modal-content');
    taskForm.innerHTML = `
      <h2 class="modal-title raleway-bold">Criar Nova Tarefa</h2>
      <div>
        <label class="raleway-regular">Título da tarefa</label>
        <input type="text" id="title" placeholder="Ex: Estudar para a prova"/>
      </div>
      <div>
        <label class="raleway-regular">Descrição</label>
        <textarea id="description" rows="4" class="raleway-thin" placeholder="Detalhes..."></textarea>
      </div>
      <div class="additionals-infos raleway-regular">
        <select>
          <option selected value="aleatoria">Aleatórias</option>
          <option value="Organiza-Aí">Organiza-Aí</option>
          <option value="javascript">Curso JavaScript</option>
        </select>
        <input type="date" id="due-date" class="raleway-thin"/>
      </div>
      <div class="buttons-container">
        <button class="button cancel-button raleway-regular">Cancelar</button>
        <button class="button confirm-button raleway-regular">Adicionar Tarefa</button>
      </div>
    `;
    taskModal.appendChild(taskForm);

    const confirmButton = taskForm.querySelector('.confirm-button');
    confirmButton.addEventListener('click', async () => {
      const user_id = 8;
      const title = document.getElementById('title').value || null;
      const description = document.getElementById('description').value || null;
      const project_id = null;
      const collumn_id = null;
      const is_habit = false;
      const recurrence = null;
      const due_date = document.getElementById('due-date').value || null;

      const task_info = {
        user_id,
        title,
        description,
        project_id,
        collumn_id,
        is_habit,
        recurrence,
        due_date
      };

      await createTask(task_info);

      content.removeChild(taskModal);
      taskModal.removeChild(taskForm);

      await renderTasks();
    });

    const cancelButton = taskForm.querySelector('.cancel-button');
    cancelButton.addEventListener('click', () => {
      content.removeChild(taskModal);
      taskModal.removeChild(taskForm);
    });

    taskModal.addEventListener('click', (event) => {
      if (event.target === taskModal) {
        content.removeChild(taskModal);
        taskModal.removeChild(taskForm);
      }
    });
  });
});
