const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const progress = document.getElementById("progress");
const emptyState = document.getElementById("empty-state");
const themeToggle = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>${task.text} - ${task.date}</span>
      <div>
        <button onclick="toggleTask(${realIndex})">✔</button>
        <button onclick="startEdit(${realIndex})">✏</button>
        <button onclick="deleteTask(${realIndex})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  totalCount.textContent = tasks.length;

  const completed = tasks.filter(t => t.completed).length;
  completedCount.textContent = completed;

  progress.style.width = tasks.length
    ? (completed / tasks.length) * 100 + "%"
    : "0%";

  emptyState.style.display = tasks.length === 0 ? "block" : "none";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (taskInput.value.trim() === "" || dateInput.value === "") return;

  tasks.push({
    text: taskInput.value,
    date: dateInput.value,
    completed: false
  });

  saveTasks();
  renderTasks();
  form.reset();
});

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function startEdit(index) {
  const li = [...taskList.children].find(child =>
    child.innerText.includes(tasks[index].text)
  );

  li.innerHTML = `
    <input type="text" id="edit-text" value="${tasks[index].text}">
    <input type="date" id="edit-date" value="${tasks[index].date}">
    <button onclick="saveEdit(${index})">💾</button>
    <button onclick="renderTasks()">❌</button>
  `;
}

function saveEdit(index) {
  const newText = document.getElementById("edit-text").value;
  const newDate = document.getElementById("edit-date").value;

  if (newText.trim() === "" || newDate === "") return;

  tasks[index].text = newText;
  tasks[index].date = newDate;

  saveTasks();
  renderTasks();
}

document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderTasks();
