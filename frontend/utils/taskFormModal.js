import { createTask, readTask, updateTaskStatus } from "./createTasks.js"

export async function taskFormModal(content, options = {}) {
    const {
        defaultProject = 'aleatoria',
        defaultDate = '',
        onTaskCreated
    } = options;

    const taskModal = document.createElement('div');
    taskModal.classList.add("modal-overlay");

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
        <select id="project-select">
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

    const selectProject = document.getElementById('project-select')
    const dueDateInput = document.getElementById('due-date')

    selectProject.value = defaultProject
    dueDateInput.value = defaultDate

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

      await onTaskCreated();
    });

    const cancelButton = taskForm.querySelector('.cancel-button');
    cancelButton.addEventListener('click', () => {
      content.removeChild(taskModal);
      taskModal.removeChild(taskForm);
    });
    
  }