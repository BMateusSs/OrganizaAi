document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('#habits');

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Adicionar hábito';
    content.appendChild(addBtn);

    // Variáveis globais para rastreamento de estado
    let selectedDays = [];
    const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']; 

    // --- 1. Função que Cria e Insere o Modal ---
    function habitFormModal(container) {
        const habitsModal = document.createElement('div');
        habitsModal.classList.add("modal-overlay");

        const habitContent = document.createElement('div');
        habitContent.classList.add('modal-content');
        
        // Inclui o X de fechar no HTML, mas aqui usaremos a lógica do botão 'Cancelar'
        habitContent.innerHTML = ` 
            <h2>Criar novo hábito</h2>
            <form id="habit-form">
                <label for="habit-title">Título</label>
                <input id="habit-title" type="text" name="title" required/>

                <label for="description">Descrição (Opicional)</label>
                <input id="description" type="text" name="description" rows="4"/>

                <label for="recurrence-type">Definir recorrencia</label>
                <select id="recurrence-type" name="recurrence-type-selection" required>
                    <option value="DAILY">Diária</option>
                    <option value="WEEKLY" selected>Semanalmente</option>
                    <option value="MONTHLY">Mensalmente</option>
                </select>

                <div id="recurrence-details">
                    
                    <div id="weekly-days-selector">
                        <label>Repetir em (Dias da Semana):</label>
                        <div id="day-selector" class="day-buttons">
                            <button type="button" data-day="MON">Seg</button>
                            <button type="button" data-day="TUE">Ter</button>
                            <button type="button" data-day="WED">Qua</button>
                            <button type="button" data-day="THU">Qui</button>
                            <button type="button" data-day="FRI">Sex</button>
                            <button type="button" data-day="SAT">Sáb</button>
                            <button type="button" data-day="SUN">Dom</button>
                        </div>
                    </div>
                    
                    <div id="monthly-day-selector" style="display:none;"> 
                        <label for="month-day">Repetir no Dia do Mês:</label>
                        <input type="number" id="month-day" min="1" max="31" value="1" placeholder="1 a 31">
                    </div>

                </div> 

                <input type="hidden" id="habit-recurrence-string" name="recurrence"> 
                
                <button type="button" class="button cancel-button">Cancelar</button>
                <button type="submit" class="button confirm-button">Salvar Hábito</button>
            </form>
        `;
        
        habitsModal.appendChild(habitContent);
        container.appendChild(habitsModal);
        
        // --- 2. Configuração de Listeners no Modal Criado ---
        
        const elementForm = habitContent.querySelector('#habit-form');
        const recurrenceType = habitContent.querySelector('#recurrence-type');
        const cancelBtn = habitContent.querySelector('.cancel-button');
        const dayButtons = habitContent.querySelectorAll('.day-buttons button');
        const monthDayInput = habitContent.querySelector('#month-day');

        // A. Inicializa o estado visual
        handleRecurrenceType({ target: recurrenceType });

        // B. Event Listeners para a Recorrência
        recurrenceType.addEventListener('change', handleRecurrenceType);
        monthDayInput.addEventListener('change', () => updateRecurrenceString(elementForm, recurrenceType.value));

        // C. Event Listeners para os Botões de Dia
        dayButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); 
                toggleDaySelection(event.target, elementForm, recurrenceType.value);
            });
        });

        // D. Event Listeners para Ação
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });

        elementForm.addEventListener('submit', (e) => {
             e.preventDefault();
             updateRecurrenceString(elementForm, recurrenceType.value); // Finaliza a string
             submitHabit(elementForm);
        });
    }

    // --- 3. Funções de Controle do Modal ---

    addBtn.addEventListener('click', openModal);

    function openModal(){
        // Reseta o estado antes de abrir um novo modal
        selectedDays = []; 
        habitFormModal(content);
    }

    function closeModal(){
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    // --- 4. Lógica de Seleção de Dias da Semana ---

    function toggleDaySelection(button, elementForm, type) {
        const day = button.getAttribute('data-day');
        
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
            selectedDays = selectedDays.filter(d => d !== day);
        } else {
            button.classList.add('selected');
            selectedDays.push(day);
        }
        
        updateRecurrenceString(elementForm, type);
    }

    // --- 5. Lógica de Visualização e Construção da String ---

    function handleRecurrenceType(event){
        const recurrenceType = event.target;
        const elementForm = recurrenceType.closest('form');
        const type = recurrenceType.value;
        
        const weeklyBtn = elementForm.querySelector('#weekly-days-selector');
        const monthlyBtn = elementForm.querySelector('#monthly-day-selector');

        monthlyBtn.style.display = 'none';
        weeklyBtn.style.display = 'none';
        
        // Lógica de exibição
        if (type === 'WEEKLY'){
            weeklyBtn.style.display = 'block';
        } else if (type === 'MONTHLY'){
            monthlyBtn.style.display = 'block';
        }

        updateRecurrenceString(elementForm, type);
    }

    function updateRecurrenceString(elementForm, type){
        const recurrenceStringInput = elementForm.querySelector('#habit-recurrence-string');
        const monthDayInput = elementForm.querySelector('#month-day');
        recurrenceStringInput.value = '';

        if (type === 'DAILY'){
            recurrenceStringInput.value = 'DAILY'; // Corrigido para a string de backend
        } 
        else if (type === 'WEEKLY'){
            // Pega os dias selecionados (global) e cria a string 'MON,TUE,FRI'
            const finalSelection = dayOrder.filter(day => selectedDays.includes(day)).join(',');
            recurrenceStringInput.value = finalSelection;
        }
        else if (type === 'MONTHLY'){
            const day = parseInt(monthDayInput.value);
            // Valida e formata a string 'MONTHLY:XX'
            if (day >= 1 && day <= 31 && !isNaN(day)) {
                recurrenceStringInput.value = `MONTHLY:${day}`;
            }
        }
    }
    
    // --- 6. Lógica de Submissão (Final) ---
    function submitHabit(elementForm){
        const formData = new FormData(elementForm);
        const habitData = {
            title: formData.get('title'),
            description: formData.get('description'),
            recurrence: formData.get('recurrence'), // Pega o valor do input hidden
            // Outros dados necessários
        };

        // Validação final
        if (!habitData.title || !habitData.recurrence) {
            alert("Título e Recorrência são obrigatórios!");
            return;
        }
        
        // Simulação de chamada de API (fetch)
        console.log("Dados prontos para envio:", habitData);
        // Seu código de fetch() iria aqui...
        
        // Fechamento e confirmação após sucesso (simulado)
        alert(`Hábito '${habitData.title}' com recorrência '${habitData.recurrence}' pronto para envio!`);
        closeModal();
    }
});