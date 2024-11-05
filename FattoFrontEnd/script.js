const baseUrl = "http://localhost:8080/task";
let editingTaskId = null;

function showAddTaskForm() {
    document.getElementById("addTaskForm").classList.remove("d-none");
}

function hideAddTaskForm() {
    document.getElementById("addTaskForm").classList.add("d-none");
}

async function addTask(event) {
    event.preventDefault();
    const name = document.getElementById("taskName").value;
    const custo = document.getElementById("taskCusto").value;
    const dataLimite = document.getElementById("taskDataLimite").value;

    if (name && custo && dataLimite) {
        const task = { nome: name, custo: parseFloat(custo), dataLimite };

        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            });

            if (response.ok) {
                alert("Tarefa adicionada com sucesso!");
                hideAddTaskForm();
                loadTasks();
            } else {
                alert("Erro ao adicionar tarefa.");
            }
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

async function loadTasks() {
    try {
        const response = await fetch(baseUrl);
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            console.error("Erro ao carregar tarefas.");
        }
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
    }
}

function displayTasks(tasks) {
    const taskTableBody = document.getElementById("taskTableBody");
    taskTableBody.innerHTML = "";

    tasks.forEach((task) => {
        const row = document.createElement("tr");

        const custoClass = task.custo > 1000 ? "highlight-custo" : "";
        const formattedDate = task.dataLimite ? new Date(task.dataLimite).toLocaleDateString("pt-BR") : '';

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.nome}</td>
            <td class="${custoClass}">${task.custo}</td>
            <td>${formattedDate}</td>
            <td>${task.ordem}</td>
            <td>
                <button class="btn btn-warning" onclick="openEditTaskModal(${task.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteTask(${task.id})">Excluir</button>
                <button class="btn btn-secondary" onclick="moveTaskUp(${task.id})">↑</button>
                <button class="btn btn-secondary" onclick="moveTaskDown(${task.id})">↓</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

async function openEditTaskModal(taskId) {
    try {
        const response = await fetch(`${baseUrl}/${taskId}`);
        if (response.ok) {
            const task = await response.json();
            editingTaskId = task.id;
            document.getElementById("editTaskName").value = task.nome;
            document.getElementById("editTaskCusto").value = task.custo;
            document.getElementById("editTaskDataLimite").value = task.dataLimite ? task.dataLimite.split('T')[0] : '';

            $('#editTaskModal').modal('show');
        } else {
            alert("Erro ao carregar a tarefa para edição.");
        }
    } catch (error) {
        console.error("Erro ao abrir o modal de edição:", error);
    }
}

async function saveTaskChanges() {
    const updatedTask = {
        nome: document.getElementById("editTaskName").value,
        custo: parseFloat(document.getElementById("editTaskCusto").value),
        dataLimite: document.getElementById("editTaskDataLimite").value
    };

    try {
        const response = await fetch(`${baseUrl}/${editingTaskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });

        if (response.ok) {
            alert("Tarefa atualizada com sucesso!");
            $('#editTaskModal').modal('hide');
            loadTasks();
        } else {
            alert("Erro ao atualizar tarefa.");
        }
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
    }
}

async function deleteTask(id) {
    const userConfirmed = confirm("Tem certeza que deseja excluir esta tarefa?");
    if (userConfirmed) {
        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("Tarefa excluída com sucesso!");
                loadTasks();
            } else {
                alert("Erro ao excluir tarefa.");
            }
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
        }
    }
}

async function moveTaskUp(id) {
    try {
        const response = await fetch(`${baseUrl}/${id}/mover-cima`, {
            method: "PATCH"
        });
        if (response.ok) {
            loadTasks();
        } else {
            console.error("Erro ao mover tarefa para cima", response.statusText);
            alert("Erro ao mover tarefa para cima.");
        }
    } catch (error) {
        console.error("Erro ao mover tarefa para cima:", error);
    }
}

async function moveTaskDown(id) {
    try {
        const response = await fetch(`${baseUrl}/${id}/mover-baixo`, {
            method: "PATCH"
        });
        if (response.ok) {
            loadTasks();
        } else {
            console.error("Erro ao mover tarefa para baixo", response.statusText);
            alert("Erro ao mover tarefa para baixo.");
        }
    } catch (error) {
        console.error("Erro ao mover tarefa para baixo:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadTasks);
