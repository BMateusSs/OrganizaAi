import { createTask, readTask, updateTaskStatus } from "./createTasks.js"

export async function projectFormModal(content, options = {}) {
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
      <h2 class="modal-title raleway-bold">Criar Novo Projeto</h2>
      <div>
        <label class="raleway-regular">Nome</label>
        <input type="text" id="title" placeholder="Ex: Estudar para a prova"/>
      </div>
      <div>
      <label class="raleway-regular">Cor</label>
      <button class="dropdown-btn">
        <div class="circle coyote"></div> Coyote
      </button>
        <div class="dropdown-content">
          <div data-color="Coyote" class=" raleway-thin"><div class="circle coyote"></div> Coyote</div>
          <div data-color="Russian Violet" class=" raleway-thin"><div class="circle russian-violet"></div> Russian Violet</div>
          <div data-color="Lapis Lazuli" class=" raleway-thin"><div class="circle lapis-lazuli"></div> Lapis Lazuli</div>
          <div data-color="Azul" class=" raleway-thin"><div class="circle jordy-blue"></div> Jordy Blue </div>
          <div data-color="Plum" class=" raleway-thin"><div class="circle plum"></div> Plum</div>
          <div data-color="Cyclamen" class=" raleway-thin"><div class="circle cyclamen"></div> Cyclemen</div>
          <div data-color="Amaranth" class=" raleway-thin"><div class="circle amaranth"></div> Amaranth</div>
          <div data-color="Pear" class=" raleway-thin"><div class="circle pear"></div> Pear</div>
        </div>
      </div>
      <div>
        <label class="raleway-regular">Layout</label>
        <div class="pick-layout">
          <button>Lista</button>
          <button>Kanban</button>
        </div>
      </div>
      <div class="buttons-container">
        <button class="button cancel-button raleway-regular">Cancelar</button>
        <button class="button confirm-button raleway-regular">Adicionar projeto</button>
      </div>
    `;

    taskModal.appendChild(taskForm);

    const btn = document.querySelector('.dropdown-btn')
    const dropdownContent = document.querySelector('.dropdown-content')

    btn.addEventListener('click', () => {
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block'
    })

    dropdownContent.querySelectorAll('div').forEach(option => {
      option.addEventListener('click', () => {
        const colorName = option.dataset.color;
        const colorClass = option.classList[0];
        btn.innerHTML = `<div class="circle ${colorClass}"></div> ${colorName}`;
        dropdownContent.style.display = "none";
      })
    })

    const cancelButton = taskForm.querySelector('.cancel-button');
    cancelButton.addEventListener('click', () => {
      content.removeChild(taskModal);
      taskModal.removeChild(taskForm);
    });
    
  }