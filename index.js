const projectsContainer = document.querySelector("[data-projects]");
const activeProjectContainer = document.querySelector(
  "[data-active-project-container]"
);
const newProjectForm = document.querySelector("[data-new-project-form]");
const newProjectInput = document.querySelector("[data-new-project-input]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const newTaskNotesInput = document.querySelector("[data-new-notes-input]");
const newTaskDateInput = document.querySelector("[data-new-date-input]");
const taskList = document.querySelector("[data-task-list]");
const deleteProjectBtn = document.querySelector("[data-delete-project-btn]");
const selectedProjectName = document.querySelector(
  "[data-selected-project-name]"
);
const LOCAL_STORAGE_PROJECT_KEY = "project.lists";
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "project.selectedProjectId";
const checkbox = document.querySelector;

let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

let selectedProjectId = null;

// JSON.parse(
//   localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY)
// );

//add event listener to project container in order to assign selected project
projectsContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.dataset.projectId;
    saveAndRender();
  }
});
//add event listener to mark tasks as completed
activeProjectContainer.addEventListener("click", e => {
  if (e.target.classList.contains("checkbox") === true) {
    const selectedProject = projects.find(
      project => project.id === selectedProjectId
    );
    const selectedTask = selectedProject.tasks.find(
      task => task.id === e.target.id
    );
    selectedTask.completed = e.target.checked;
  }
  save();
});

function saveAndRender() {
  save();
  render();
}

function render() {
  clearElement(projectsContainer);

  renderProjects();
  renderTaskList();
}

function renderTaskList() {
  if (selectedProjectId == null) {
    return;
    // activeProjectContainer.style.display = "none";
  } else {
    newTaskForm.classList.remove("hidden");
    activeProjectContainer.style.display = "";
    let selectedProject = projects.find(
      project => project.id === selectedProjectId
    );
    selectedProjectName.innerText = selectedProject.name;
    selectedProject.tasks.forEach(task => {
      const listElement = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.classList.add("checkbox");
      const label = document.createElement("label");
      // label.htmlFor = task.id;
      checkbox.id = task.id;
      checkbox.checked = task.completed;
      checkbox.type = "checkbox";
      const listItemContainer = document.createElement("div");
      listItemContainer.classList.add("list-item-container");
      taskList.appendChild(listItemContainer);

      listElement.classList.add("list-item");
      listElement.innerText = task.name;
      listItemContainer.appendChild(checkbox);

      listItemContainer.appendChild(listElement);

      if (task.dueDate !== "") {
        const dueDateContainer = document.createElement("div");
        const dueDate = task.dueDate;
        dueDateContainer.classList.add("due-date-container");
        dueDateContainer.innerText = dueDate;

        listItemContainer.appendChild(dueDateContainer);
      }

      if (task.notes !== "") {
        const listNoteElement = document.createElement("p");
        const listNoteElementContainer = document.createElement("div");
        listNoteElementContainer.classList.add("list-note-element-container");
        listNoteElement.classList.add("list-notes");
        listItemContainer.appendChild(listNoteElementContainer);
        listNoteElement.innerText = `notes: ${task.notes}`;
        taskList.appendChild(listNoteElement);
      }
    });
  }
  save();
}

function renderProjects() {
  clearElement(taskList);
  projects.forEach(project => {
    const projectElement = document.createElement("li");
    projectElement.dataset.projectId = project.id;
    projectElement.classList.add("project-name");
    projectElement.innerText = project.name;
    if (project.id === selectedProjectId) {
      projectElement.classList.add("selected-project");
    }
    projectsContainer.appendChild(projectElement);
  });
}

deleteProjectBtn.addEventListener("click", e => {
  projects = projects.filter(project => project.id !== selectedProjectId);
  selectedProjectId = null;

  save();
  render();
});

function save() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
render();

newProjectForm.addEventListener("submit", e => {
  e.preventDefault();
  if (newProjectInput.value == null || newProjectInput.value === "") return;
  const project = new Project(newProjectInput.value);
  selectedProjectId = project.id;
  newProjectInput.value = null;
  projects.push(project);
  saveAndRender();
});

newTaskForm.addEventListener("submit", e => {
  e.preventDefault();
  if (newTaskInput.value == null || newTaskInput.value === "") return;
  let selectedProject = projects.find(
    project => project.id === selectedProjectId
  );
  let task = new Task(
    newTaskInput.value,
    newTaskNotesInput.value,
    newTaskDateInput.value
  );
  selectedProject.tasks.push(task);
  newTaskInput.value = null;
  newTaskNotesInput.value = null;
  newTaskDateInput.value = null;
  saveAndRender();
});

class Project {
  constructor(name) {
    this.name = name;
    this.id = Date.now().toString();
    this.tasks = [];
  }
}

class Task {
  constructor(name, notes, dueDate) {
    this.name = name;
    this.id = Date.now().toString();
    this.notes = notes;
    this.dueDate = dueDate;
    this.completed = false;
  }
}

// //make homepage with all tasks in all projects
// make due date functionality work

function renderHomePage() {
  if (selectedProjectId !== null) return;
  renderProjects();
  activeProjectContainer.style.display = "";
  clearElement(activeProjectContainer);
  projects.forEach(project => {
    const projectName = document.createElement("h2");
    projectName.innerText = project.name;
    activeProjectContainer.appendChild(projectName);

    project.tasks.forEach(task => {
      const listElement = document.createElement("li");
      const checkbox = document.createElement("input");
      const listItemContainer = document.createElement("div");
      listItemContainer.classList.add("list-item-container");
      activeProjectContainer.appendChild(listItemContainer);

      checkbox.type = "checkbox";
      listElement.classList.add("list-item");
      listElement.innerText = task.name;
      listItemContainer.appendChild(checkbox);
      listItemContainer.appendChild(listElement);
    });
  });
}
// function formatDate()
// renderHomePage();
