document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("taskForm");
  form.onsubmit = function (event) {
    event.preventDefault();
    addTask({
      taskName: document.getElementById("taskName").value,
      priority: document.getElementById("priority").value,
      creationDate: new Date().toISOString()
    });
  };

  async function addTask(taskData) {
    const response = await fetch("/add", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    updateTasks(await response.json());
  }

  function updateTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => {
      let item = document.createElement("li");
      item.textContent = `${task.taskName} - Due by ${task.deadline}`;
      taskList.appendChild(item);
    });
  }
});
