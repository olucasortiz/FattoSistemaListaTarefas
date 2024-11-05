const baseUrl = "http://localhost:8080/task";
let editingTaskId = null;


function showAddTaskForm() {
    $('#addTaskModal').modal('show');
}


function hideAddTaskForm() {
    document.getElementById("addTaskForm").classList.add("d-none");
}

async function addTaskModal(event) {
    event.preventDefault();
    
    // Corrigido para usar os IDs corretos do modal
    const name = document.getElementById("addTaskName").value;
    const custo = document.getElementById("addTaskCusto").value;
    const dataLimite = document.getElementById("addTaskDataLimite").value;

    if (name && custo && dataLimite) {
        const task = { nome: name, custo: parseFloat(custo), dataLimite };

        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            });

            if (response.ok) {
                $('#addTaskModal').modal('hide');
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

async function confirmDeleteTask(id) {
    if (confirm("Tem certeza de que deseja excluir esta tarefa?")) {
        try {
            const response = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
            if (response.ok) {
                alert("Tarefa excluída com sucesso!");
                loadTasks(); // Recarrega a lista de tarefas
            } else {
                alert("Erro ao excluir tarefa.");
            }
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
        }
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
        const formattedDate = task.dataLimite ? new Date(task.dataLimite).toLocaleDateString("pt-BR") : '';

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.nome || "N/A"}</td>
            <td class="${task.custo >= 1000 ? 'highlight-custo' : ''}">${task.custo}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-warning" onclick="openEditTaskModal(${task.id})">Editar</button>
                <button class="btn btn-danger" onclick="confirmDeleteTask(${task.id})">Excluir</button>
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
        const response = await fetch(`${baseUrl}/${id}/mover-cima`, { method: "PATCH" });
        if (response.ok) {
            loadTasks(); // Recarrega as tarefas para atualizar a lista
        } else if (response.status === 400) {
            alert("A tarefa já está na primeira posição ou ocorreu um erro ao mover para cima.");
        } else {
            alert("Erro ao mover tarefa para cima.");
        }
    } catch (error) {
        console.error("Erro ao mover tarefa para cima:", error);
    }
}

async function moveTaskDown(id) {
    try {
        const response = await fetch(`${baseUrl}/${id}/mover-baixo`, { method: "PATCH" });
        if (response.ok) {
            loadTasks(); // Recarrega as tarefas para atualizar a lista
        } else if (response.status === 400) {
            alert("A tarefa já está na última posição ou ocorreu um erro ao mover para baixo.");
        } else {
            alert("Erro ao mover tarefa para baixo.");
        }
    } catch (error) {
        console.error("Erro ao mover tarefa para baixo:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadTasks);
