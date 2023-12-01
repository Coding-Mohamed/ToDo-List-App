const inputElement = document.getElementById("inputText");
const btnElement = document.getElementById("btn");
const mainElement = document.querySelector(".main");
const errorElement = document.querySelector("#error");
const apiUrl = "https://js1-todo-api.vercel.app/api/todos";
const apiKey = "c30d6374-b623-4c3b-a29b-38a9cba98201";

btnElement.addEventListener("click", function (e) {
  e.preventDefault();
  const task = inputElement.value.trim();
  if (task === "") {
    errorElement.style.display = "block";
    setTimeout(function () {
      errorElement.style.display = "none";
    }, 3000);
    return;
  }
  saveTask(task);
  inputElement.value = "";
});

// New task element
function createTaskElement(task) {
  const newTask = document.createElement("div");
  newTask.classList.add("output");
  newTask.innerText = task.title.trim();
  mainElement.appendChild(newTask);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML =
    '<i class="fa-solid fa-trash-can fa-xl" style="color: #c81e40;"></i>';
  newTask.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", function () {
    if (!newTask.classList.contains("completed")) {
      const modal = document.querySelector(".modal");
      if (modal) {
        return;
      }

      const modalElement = document.createElement("div");
      modalElement.classList.add("modal");
      modalElement.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <p>Please complete the task before deleting.</p>
        </div>
      `;
      mainElement.appendChild(modalElement);

      const closeBtn = modalElement.querySelector(".close");
      closeBtn.addEventListener("click", function () {
        modalElement.remove();
      });

      setTimeout(function () {
        modalElement.remove();
      }, 10000);

      return;
    }

    newTask.remove();

    // Removing the task from the database.
    fetch(`${apiUrl}/${task._id}?apikey=${apiKey}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("completed");
  editBtn.innerHTML =
    '<i class="fa-solid fa-check fa-xl" style="color:#127f10;"></i>';
  newTask.appendChild(editBtn);

  editBtn.addEventListener("click", function () {
    if (newTask.classList.contains("completed")) {
      newTask.classList.remove("completed");
      editBtn.querySelector("i").style.color = "#127f10";
      updateTaskStatus(task._id, false);
    } else {
      newTask.classList.add("completed");
      editBtn.querySelector("i").style.color = "#808080";
      updateTaskStatus(task._id, true);
    }
  });

  // Checking if the task is completed.
  if (task.completed) {
    newTask.classList.add("completed");
    editBtn.querySelector("i").style.color = "#808080";
  }

  return newTask;
}

// GET method to fetch data from the database.
fetch(`${apiUrl}?apikey=${apiKey}`)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((element) => {
      const newTask = createTaskElement(element);
      mainElement.appendChild(newTask);
    });
  });

// POST method to add a task to the database
function saveTask(task) {
  fetch(`${apiUrl}?apikey=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: task }),
  })
    .then((response) => response.json())
    .then((data) => {
      const newTask = createTaskElement(data);
      mainElement.appendChild(newTask);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// PUT method to update the "completed" status in the database
function updateTaskStatus(taskId, completed) {
  fetch(`${apiUrl}/${taskId}?apikey=${apiKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: completed }),
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error:", error);
    });
}
