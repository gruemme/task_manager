function sendData(data) {
    fetch('/tasks', {
        method: 'POST', headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(e => location.href = "index.html")
        .catch(e => {
            const newDiv = document.createElement("div");
            newDiv.textContent = `Error: ${e.status} ${e.statusText}`;
            newDiv.className = 'alert alert-danger';
            document.getElementById('errorMessage').replaceChildren(newDiv);
        });
}

function createTask() {
    let newTask = {};
    newTask.name = document.getElementById('inputName').value;
    const radioElement = document.querySelector("[name=priority]:checked");
    const labelToSelectedRadioElement = document.querySelector("label[for=" + radioElement.id + "]");
    newTask.priority = labelToSelectedRadioElement.textContent;

    sendData(newTask);
}
