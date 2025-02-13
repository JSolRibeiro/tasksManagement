window.addEventListener('resize', () => {
    document.getElementById('toDoList').innerHTML = "";
    renderTaskList();
})

const countTasks = (tasks) => {
    let countTasks;
    const countTasksDom = document.getElementById('tasks-progress');

    if (countTasksDom) countTasks = countTasksDom;
    else {
        const newCountTasksDom = document.createElement('div');
        newCountTasksDom.id = 'tasks-progress';
        document.getElementsByTagName('footer')[0].appendChild(newCountTasksDom);
        countTasks = newCountTasksDom;
    }

    const doneTasks = tasks.filter(({ checked }) => checked).length;
    const allTasks = tasks.length;
    countTasks.textContent = `${doneTasks}/${allTasks} concluídas`;

}

const setTasksInLocalStorage = (tasks) => {
    tasks = tasks.filter(task => task.description.length > 1);
    window.localStorage.setItem('tasks', JSON.stringify(tasks));

}

const getTasksFromLocalStorage = () => {
    const updatedTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return updatedTasks ? updatedTasks : [];
}


const removeCompletedTasks = () => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter((task) => !task.checked);

    setTasksInLocalStorage(updatedTasks);
    renderTaskList();
}

const deleteTask = (id) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter((task) => task.id !== id);

    setTasksInLocalStorage(updatedTasks);
    renderTaskList();
}

const editTask = (id) => {
    const tasks = getTasksFromLocalStorage();
    const taskToEdit = tasks.find((task) => task.id === id);

    if (!taskToEdit) return;

    const itemList = document.getElementById(id);
    itemList.innerHTML = '';

    const inputDescription = document.createElement('input');
    inputDescription.type = 'text';
    inputDescription.value = taskToEdit.description;

    const textAreaDesciption = document.createElement('textarea');
    textAreaDesciption.value = taskToEdit.detailedDescription;

    const saveButton = document.createElement('button');
    saveButton.classList.add('save-btn', 'fas', 'fa-floppy-disk')
    saveButton.onclick = () => {
        taskToEdit.description = inputDescription.value;
        taskToEdit.detailedDescription = textAreaDesciption.value;

        const updatedTasks = tasks.map((task) =>
            task.id === id ? taskToEdit : task
        );
        setTasksInLocalStorage(updatedTasks);
        renderTaskList();
    }

    const cancelIcon = document.createElement('i');
    cancelIcon.classList.add('fas', 'fa-ban');

    const cancelEdition = document.createElement('button');
    cancelEdition.className = 'cancelBtn';
    cancelEdition.onclick = renderTaskList;
    cancelEdition.appendChild(cancelIcon);

    const wrapper = document.createElement('div');
    wrapper.className = 'editWrapper';
    const buttons = document.createElement('div');
    buttons.className = 'btnsEdit';

    buttons.appendChild(saveButton);
    buttons.appendChild(cancelEdition);
    wrapper.appendChild(inputDescription);
    wrapper.appendChild(textAreaDesciption);
    itemList.appendChild(wrapper);
    itemList.appendChild(buttons);
}

const createTaskItem = (task, checkbox) => {
    const taskList = document.getElementById('toDoList');
    const input = document.getElementById('description');
    const itemList = document.createElement('li');
    const editIcon = document.createElement('i');
    editIcon.classList.add('far', 'fa-edit');

    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.appendChild(editIcon);
    editButton.onclick = () => editTask(task.id);

    const delIcon = document.createElement('i');
    const delButton = document.createElement('button');
    delButton.className = 'delButton';
    delIcon.classList.add('far', 'fa-trash-can')
    delButton.appendChild(delIcon);
    delButton.onclick = () => deleteTask(task.id);

    if (window.innerWidth <= 450) {
        const buttons = document.createElement('span');
        buttons.appendChild(delButton);
        buttons.appendChild(editButton);
        itemList.appendChild(buttons);

        itemList.appendChild(checkbox);
        itemList.id = task.id;
        taskList.appendChild(itemList)
    } else {

        input.classList.remove('empty')
        itemList.appendChild(delButton);
        itemList.appendChild(editButton);

        itemList.appendChild(checkbox);
        itemList.id = task.id;
        taskList.appendChild(itemList)
    }
    return itemList;

}

const showEmptyMessage = () => {
    const tasks = getTasksFromLocalStorage();
    const list = document.getElementById('toDoList');
    let emptyMessage = document.getElementById('emptyMessage');
    const done = document.createElement('i');
    done.classList.add('fas', 'fa-circle-check');

    if (!emptyMessage) {
        emptyMessage = document.createElement('p');
        emptyMessage.appendChild(done);
        emptyMessage.id = 'emptyMessage';
        emptyMessage.textContent = 'Nenhuma tarefa adicionada.';
        emptyMessage.style.display = 'flex';
        emptyMessage.style.width = '100%';
        emptyMessage.style.height = '20rem';
        emptyMessage.style.color = 'gray'; // Opcional, para estilizar
        emptyMessage.style.justifyContent = 'center';
        emptyMessage.style.alignItems = 'center'
        emptyMessage.style.fontSize = '2rem'
    }

    if (tasks.length === 0) {
        if (!list.contains(emptyMessage)) {
            list.appendChild(emptyMessage);
            emptyMessage.appendChild(done);
        }
    } else {
        if (emptyMessage.parentNode) {
            emptyMessage.remove();
        }
    }
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();

    if (tasks.length === 0) return 1;

    const maxId = Math.max(...tasks.map(task => task.id));
    return maxId + 1;
};

const onCheckboxClick = (event) => {
    const [id] = event.target.id.split('-');
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map((task) =>
        parseInt(id) === parseInt(task.id)
            ? { ...task, checked: event.target.checked }
            : task
    );

    updatedTasks.sort((a, b) => a.checked - b.checked);

    setTasksInLocalStorage(updatedTasks)
    renderTaskList();
};

const renderTaskList = () => {
    const list = document.getElementById('toDoList');
    list.innerHTML = '';
    const tasks = getTasksFromLocalStorage();

    tasks.forEach((task) => {
        const checkbox = getCheckBoxAndTask(task);
        const taskItem = createTaskItem(task, checkbox);

        if (task.checked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
    });
    showEmptyMessage();
    countTasks(tasks);

}

const getCheckBoxAndTask = ({ id, description, detailedDescription, checked }) => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    const taskId = `${id}-checkbox`;
    const title = document.createElement('p');
    const detail = document.createElement('p');
    const labelCheck = document.createElement('label');
    labelCheck.className = 'labelCheck';
    labelCheck.htmlFor = taskId;

    title.textContent = description;
    detail.textContent = detailedDescription;
    label.className = 'labelTaks';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = taskId;
    checkbox.className = 'check';
    checkbox.checked = checked;
    checkbox.onclick = onCheckboxClick;

    if (window.innerWidth <= 450) {
        wrapper.appendChild(checkbox);
        label.appendChild(title);
        wrapper.appendChild(label);
        label.appendChild(detail);
        wrapper.appendChild(labelCheck)
    } else {

        label.appendChild(title);

        wrapper.appendChild(label);
        label.appendChild(detail);
        wrapper.appendChild(checkbox);
        wrapper.appendChild(labelCheck)

    }

    return wrapper;

}

const getNewTaskData = (event) => {
    const id = getNewTaskId();
    const description = event.target.elements.description.value;
    const detailedDescription = event.target.elements.detailedDescription.value;
    return { id, description, detailedDescription, checked: false, image: '' };
}

createTasks = (event) => {
    event.preventDefault();
    const NewTaskData = getNewTaskData(event);
    const checkbox = getCheckBoxAndTask(NewTaskData);
    const inputTask = document.getElementById('description');
    const inputTaskDescription = document.getElementById('DetailedDescription');
    if (!event.target.description.value) {
        inputTask.classList.add('empty');
    } else {
        inputTask.classList.remove('empty');
        createTaskItem(NewTaskData, checkbox)

        const tasks = getTasksFromLocalStorage();
        const updatedTasks = [...tasks, NewTaskData];
        setTasksInLocalStorage(updatedTasks);
        showEmptyMessage();
        countTasks(updatedTasks);
    }
    inputTask.value = '';
    inputTaskDescription.value = '';
}

window.onload = () => {
    const form = document.getElementById('formTask');
    const input = document.getElementById('description');
    const detailedDescription = document.getElementById('DetailedDescription');

    detailedDescription.addEventListener('focus', (event) => {
        detailedDescription.style.height = "15rem";
        event.target.placeholder = "";

    })

    input.addEventListener('blur', (event) => {
        event.target.placeholder = "Qual tarefa deseja cadastrar?"
    })

    detailedDescription.addEventListener('blur', (event) => {
        event.target.placeholder = "Detalhes sobre a sua tarefa";
    })
    form.addEventListener('submit', createTasks)
    document.addEventListener('click', (event) => {
        if (!detailedDescription.contains(event.target)) {
            detailedDescription.style.height = "4rem";
        }
    })

    renderTaskList();
};