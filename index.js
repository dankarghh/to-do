const projectsContainer = document.querySelector("[data-projects]");
const activeProjectContainer = document.querySelector(
  "[data-active-project-container]"
);
const newProjectForm = document.querySelector("[data-new-project-form]");
const newProjectInput = document.querySelector("[data-new-project-input]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
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

let selectedProjectId;

// JSON.parse(
//   localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY)
// );

projectsContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.dataset.projectId;
    saveAndRender();
  }
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
    activeProjectContainer.style.display = "none";
  } else {
    activeProjectContainer.style.display = "";
    let selectedProject = projects.find(
      project => project.id === selectedProjectId
    );
    selectedProjectName.innerText = selectedProject.name;
    selectedProject.tasks.forEach(task => {
      const listElement = document.createElement("li");
      const checkbox = document.createElement("input");
      const listItemContainer = document.createElement("div");
      listItemContainer.classList.add("list-item-container");
      taskList.appendChild(listItemContainer);

      checkbox.type = "checkbox";
      listElement.classList.add("list-item");
      listElement.innerText = task.name;
      listItemContainer.appendChild(checkbox);
      listItemContainer.appendChild(listElement);
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
  let task = new Task(newTaskInput.value);
  selectedProject.tasks.push(task);
  newTaskInput.value = null;
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
  constructor(name) {
    this.name = name;
    this.id = Date.now().toString();
    this.notes = "";
    this.dueDate = "";
    this.completed = false;
  }
}

// add checkbox which changes completed status
//make proper add task modal that opens when click new task
//make homepage with all tasks in all projects
