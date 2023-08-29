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
            <a class="page-link" ${data.first ? '' : 'href="index.html?page=' + (currentPage - 1) + '"'}>Previous</a>
    </li>`;
    for (let i = 0; i < data.totalPages; ++i) {
        paginationFragment += `<li class="page-item"><a class="page-link ${i == currentPage ? 'disabled' : ''}" ${i != currentPage ? 'href="index.html?page=' + i + '"' : ''}>${i + 1}</a></li>`;
    }
    paginationFragment += `<li class="page-item ${data.last ? 'disabled' : ''}">
            <a class="page-link" ${data.last ? '' : 'href="index.html?page=' + (+currentPage + 1) + '"'}>Next</a>
        </li></ul></nav>`;

    return paginationFragment;
}

function renderTask(taskData) {
    return `<task-item taskId="${taskData.id}" name="${taskData.name}" done="${taskData.done}" priority="${taskData.priority}" created="${taskData.created}"></task-item>`
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