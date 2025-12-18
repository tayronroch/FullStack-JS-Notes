const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

const validateInput = () => inputElement.value.trim().length > 0;

const handleAddTask = () => {
  const inputIsValid = validateInput();

  if (!inputIsValid) {
    return inputElement.classList.add("error");
  }

  createTaskItem(inputElement.value);

  inputElement.value = "";
  updateLocalStorage();
};

const createTaskItem = (description, isCompleted = false) => {
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskContent = document.createElement("p");
  taskContent.innerText = description;

  if (isCompleted) {
    taskContent.classList.add("completed");
  }

  taskContent.addEventListener("click", () => handleClick(taskContent));

  const deleteItem = document.createElement("i");
  deleteItem.classList.add("far");
  deleteItem.classList.add("fa-trash-alt");

  deleteItem.addEventListener("click", () =>
    handleDeleteClick(taskItemContainer)
  );

  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(deleteItem);

  tasksContainer.appendChild(taskItemContainer);
};

const handleClick = (taskContent) => {
  taskContent.classList.toggle("completed");
  updateLocalStorage();
};

const handleDeleteClick = (taskItemContainer) => {
  taskItemContainer.remove();
  updateLocalStorage();
};

const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

const updateLocalStorage = () => {
  const tasks = tasksContainer.children; // Usando children para pegar apenas Elementos

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild; // Assumindo que o primeiro filho é o <p>
    const isCompleted = content.classList.contains("completed");

    return { description: content.innerText, isCompleted };
  });

  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    createTaskItem(task.description, task.isCompleted);
  }
};

refreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());

inputElement.addEventListener("change", () => handleInputChange());

// Adicionar suporte para tecla Enter
inputElement.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleAddTask();
  }
});