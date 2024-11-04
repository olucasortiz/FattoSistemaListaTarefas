const baseUrl = "http://localhost:8080/task";

function showAddTaskForm() {
    document.getElementById("addTaskForm").classList.remove("d-none");
}

function hideAddTaskForm() {
    document.getElementById("addTaskForm").classList.add("d-none");
}

async function addTask(event) {
    event.preventDefault();
    const name = document.getElementById("taskName").value;
    const description = document.getElementById("taskDescription").value;
    
    if (name && description) {
        const task = { name, description };

        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            });

            if (response.ok) {
                alert("Tarefa adicionada com sucesso!");
                hideAddTaskForm();
                loadTasks(); // Recarrega a lista de tarefas
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
    taskTableBody.innerHTML = ""; // Limpa o conteúdo atual da tabela

    tasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${task.position}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Excluir</button>
                <button class="btn btn-secondary btn-sm" onclick="moveTaskUp(${task.id})">↑</button>
                <button class="btn btn-secondary btn-sm" onclick="moveTaskDown(${task.id})">↓</button>
            </td>
        `;

        taskTableBody.appendChild(row);
    });
}

async function editTask(id) {
    const name = prompt("Digite o novo nome da tarefa:");
    const description = prompt("Digite a nova descrição da tarefa:");
    
    if (name && description) {
        const task = { name, description };

        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            });

            if (response.ok) {
                alert("Tarefa atualizada com sucesso!");
                loadTasks();
            } else {
                alert("Erro ao atualizar tarefa.");
            }
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

async function deleteTask(id) {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
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
            alert("Tarefa movida para cima!");
            loadTasks();
        } else {
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
            alert("Tarefa movida para baixo!");
            loadTasks();
        } else {
            alert("Erro ao mover tarefa para baixo.");
        }
    } catch (error) {
        console.error("Erro ao mover tarefa para baixo:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadTasks);
