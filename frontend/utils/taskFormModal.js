import { createTask } from "./createTasks.js"
import { projectsName } from "./fetchProjects.js";

export async function taskFormModal(content, options = {}) {
  const {
    defaultProject = 'aleatoria',
    defaultDate = '',
    onTaskCreated
  } = options;

  // cria o overlay do modal
  const taskModal = document.createElement('div');
  taskModal.classList.add("modal-overlay");
  content.appendChild(taskModal);

  // cria o elemento principal do modal
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
      <input type="date" id="due-date" class="raleway-thin"/>
    </div>
    <div class="buttons-container">
      <button class="button cancel-button raleway-regular">Cancelar</button>
      <button class="button confirm-button raleway-regular">Adicionar Tarefa</button>
    </div>
  `;
  taskModal.appendChild(taskForm);

  // cria o select de projetos
  const projectSelect = document.createElement('select');
  projectSelect.id = 'project-select';

  const data = await projectsName();
  projects = await data.projects
  projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    projectSelect.appendChild(option);
  });

  // adiciona o select dentro da div additionals-infos
  const additionalInfos = taskForm.querySelector('.additionals-infos');
  additionalInfos.prepend(projectSelect);

  // define valores padrão (se existirem)
  projectSelect.value = defaultProject;
  const dueDateInput = document.getElementById('due-date');
  dueDateInput.value = defaultDate;

  // botão confirmar
  const confirmButton = taskForm.querySelector('.confirm-button');
  confirmButton.addEventListener('click', async () => {
    const user_id = 8;
    const title = document.getElementById('title').value || null;
    const description = document.getElementById('description').value || null;
    const project_id = projectSelect.value || null;
    const collumn_id = null;
    const is_habit = false;
    const recurrence = null;
    const due_date = document.getElementById('due-date').value || null;

    console.log(user_id,
      title,
      description,
      project_id,
      collumn_id,
      is_habit,
      recurrence,
      due_date)

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

    // remove o modal
    content.removeChild(taskModal);

    // executa callback (se houver)
    if (onTaskCreated) {
      await onTaskCreated();
    }
  });

  // botão cancelar
  const cancelButton = taskForm.querySelector('.cancel-button');
  cancelButton.addEventListener('click', () => {
    content.removeChild(taskModal);
  });
}
