let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addSubject() {
  const input = document.getElementById("subjectInput");
  if (!input) return;

  const value = input.value.trim();
  if (value && !subjects.includes(value)) {
    subjects.push(value);
    input.value = "";
    saveData();
    updateSubjects();
  }
}

function updateSubjects() {
  const list = document.getElementById("subjectList");
  const select = document.getElementById("taskSubject");

  if (!list || !select) return;

  list.innerHTML = "";
  select.innerHTML = "";

  subjects.forEach(subject => {
    const li = document.createElement("li");
    li.textContent = subject;
    list.appendChild(li);

    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    select.appendChild(option);
  });
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDate");
  const subjectSelect = document.getElementById("taskSubject");

  if (!taskInput || !subjectSelect) return;

  const taskValue = taskInput.value.trim();
  const subjectValue = subjectSelect.value;
  const dueDate = dueDateInput.value;

  if (taskValue && subjectValue) {
    tasks.push({
      task: taskValue,
      subject: subjectValue,
      due: dueDate,
      done: false
    });

    taskInput.value = "";
    dueDateInput.value = "";
    saveData();
    updateTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveData();
  updateTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveData();
  updateTasks();
}

function updateTasks() {
  const list = document.getElementById("taskList");
  if (!list) return;

  list.innerHTML = "";

  let filteredTasks = tasks;

  if (typeof viewMode !== "undefined") {
    if (viewMode === "pending") {
      filteredTasks = tasks.filter(t => !t.done);
    } else if (viewMode === "completed") {
      filteredTasks = tasks.filter(t => t.done);
    }
  }

  filteredTasks.forEach((t) => {
    const index = tasks.indexOf(t);
    const li = document.createElement("li");
    li.className = t.done ? "done" : "";

    li.innerHTML = `
      <div class="task-info">
        <strong>${t.subject}</strong>: ${t.task}
        <small>Due: ${t.due || "No date"}</small>
      </div>
      <div class="task-buttons">
        <button onclick="toggleTask(${index})">
          ${t.done ? "Undo" : "Done"}
        </button>
        <button class="delete-btn" onclick="deleteTask(${index})">
          Delete
        </button>
      </div>
    `;

    list.appendChild(li);
  });

  const counter = document.getElementById("taskCounter");
  const progressBar = document.getElementById("progressBar");

  if (counter && progressBar) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const percent = total ? (completed / total) * 100 : 0;

    progressBar.style.width = percent + "%";
    counter.textContent = `${completed} of ${total} tasks completed`;
  }
}

updateSubjects();
updateTasks();
