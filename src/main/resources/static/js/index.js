const queryParams = new URLSearchParams(window.location.search);
let page = queryParams.get("page");

if (page === null || page === 'undefined') {
    page = 0;
}

fetch(`/tasks?page=${page}`)
    .then(response => {
        if (!response.ok) {
            throw response;
        }
        return response.json();
    })
    .then(function (data) {
        showTasks(data);
    })
    .catch(showError);

function showTasks(data) {
    if (data.content.length === 0) {
        return;
    }
    const dataDiv = document.getElementById('content');
    let entries = '<div><ul class="list-group">';
    data.content.forEach(entry => {
        entries += renderTask(entry);
    });
    entries += '</ul></div>';
    if (data.totalPages > 1) {
        entries += renderPagination(page, data);
    }
    dataDiv.innerHTML = entries;
}

function renderPagination(currentPage, data) {
    let paginationFragment = `<nav aria-label="Page navigation example">
            <ul class="mt-3 pagination justify-content-center">
            <li class="page-item ${data.first ? 'disabled' : ''}">
            <a class="page-link" ${data.first ? '' : 'href="index.html?page='+ (currentPage - 1) + '"'}>Previous</a>
    </li>`;
    for (let i = 0; i < data.totalPages; ++i) {
        paginationFragment += `<li class="page-item"><a class="page-link" href="index.html?page=${i}">${i + 1}</a></li>`;
    }
    paginationFragment += `<li class="page-item ${data.last ? 'disabled' : ''}">
            <a class="page-link" ${data.last ? '' : 'href="index.html?page='+ (+currentPage + 1) + '"'}>Next</a>
        </li></ul></nav>`;

    return paginationFragment;
}

function formatDate(entryDate) {
    return `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}-${entryDate.getDate()} ${entryDate.getHours()}:${entryDate.getMinutes()}`;
}

function renderTask(taskData) {
    const entryDate = new Date(taskData.created);
    const entryDateFormatted = formatDate(entryDate);
    return `<li id="task-${taskData.id}" style="display: flex" class="list-group-item ${(taskData.done ? 'list-group-item-success' : 'list-group-item-warning')}">` + `<span>${taskData.id}</span>&nbsp;<span id="task-${taskData.id}-name">${taskData.name}</span>` + '<span style="flex-grow: 1"></span>' + `<i class="bi-pencil-square" data-toggle="tooltip" title="Edit Task name" onclick="setTaskNameToEditable(${taskData.id})"></i>&nbsp;` + `<span class="badge small bg-primary rounded-pill">${taskData.priority}</span>&nbsp;` + `<span class="badge small bg-secondary rounded-pill">${entryDateFormatted}</span>&nbsp;&nbsp;` + (taskData.done ? `<i class="bi-x-square" data-toggle="tooltip" title="Set Task to undone" onclick="setDoneToTask(${taskData.id},${!taskData.done})"></i>` : `<i class="bi-check-square" data-toggle="tooltip" title="Set Task to done" onclick="setDoneToTask(${taskData.id},${!taskData.done})"></i>`) + `&nbsp;<i class="bi-trash-fill" onclick="deleteTask(${taskData.id})" data-toggle="tooltip" title="Delete Task"></i>` + '</li>';
}

function setTaskNameToEditable(taskId) {
    let taskNameElement = document.getElementById(`task-${taskId}-name`);
    if (taskNameElement.tagName !== 'INPUT') {
        const taskName = taskNameElement.textContent;
        taskNameElement.outerHTML = `<input id="task-${taskId}-name" type="text" value="${taskName}">`;
        const refreshedTaskNameElement = document.getElementById(`task-${taskId}-name`);
        refreshedTaskNameElement.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                renameTask(taskId);
            }
        });
    } else {
        renameTask(taskId);
    }
}

function setDoneToTask(taskId, done) {
    let patchData = {};
    patchData.done = done;
    patchTask(taskId, patchData);
}

function renameTask(taskId) {
    const taskNameElement = document.getElementById(`task-${taskId}-name`);
    let patchData = {};
    patchData.name = taskNameElement.value;
    patchTask(taskId, patchData);
}

function patchTask(taskId, patchData) {
    fetch(`/tasks/${taskId}`, {
        method: 'PATCH', headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json',
        }, body: JSON.stringify(patchData)
    })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(taskData => {
            const updatedTaskListItem = renderTask(taskData);
            let taskListItem = document.getElementById(`task-${taskId}`);
            if (taskListItem) {
                taskListItem.outerHTML = updatedTaskListItem;
            }
            resetErrorMessage();
        })
        .catch(showError);
}

function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE', headers: {
            'Accept': '*/*',
        }
    })
        .then(response => {
            if (!response.ok && response.status !== 204) {
                throw response;
            }
            return response;
        })
        .then(e => {
            document.getElementById(`task-${taskId}`).remove();
        })
        .catch(showError);
}

function resetErrorMessage() {
    document.getElementById('errorMessage').replaceChildren();
}

function showError(responseError) {
    const newDiv = document.createElement("div");
    newDiv.className = 'alert alert-danger';
    if (responseError instanceof Response) {
        newDiv.textContent = `Error: ${responseError.status} ${responseError.statusText}`;
    } else {
        newDiv.textContent = `Error: ${responseError.name} ${responseError.message}`;
    }
    document.getElementById('errorMessage').replaceChildren(newDiv);
}