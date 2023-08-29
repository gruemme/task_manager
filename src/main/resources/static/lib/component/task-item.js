import {html, LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

// https://stackoverflow.com/questions/71621907/trying-to-add-the-lit-js-framework-to-an-existing-spring-boot-project-via-webjar

export class TaskItem extends LitElement {
    static properties = {
        taskId: {type: BigInt},
        name: {type: String},
        priority: {type: String},
        created: {type: String},
        done: {type: String},
        editName: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.taskId = 0;
        this.name = 'Nothing';
        this.priority = 'LOW';
        this.created = Date.now().toString();
        this.done = "false";
        this.editName = false;
    }

    createRenderRoot() {
        return this;
    }

    formattedCreatedDate() {
        const entryDate = new Date(this.created);
        return html`${entryDate.getFullYear()}-${entryDate.getMonth() + 1}-${entryDate.getDate()} ${entryDate.getHours().toString().padStart(2, '0')}:${entryDate.getMinutes().toString().padStart(2, '0')}`;
    }

    nameLine() {
        if (this.editName) {
            return html`<input id="task-${this.taskId}-name" type="text" value="${this.name}"
                               @change="${this.nameKeyEvent}">`;
        }

        return html`<span id="task-${this.taskId}-name">${this.name}</span>`;
    }

    render() {
        return html`
            <li id="task-${this.taskId}" style="display: flex"
                class="list-group-item ${(this.done === "true" ? 'list-group-item-success' : 'list-group-item-warning')}">
                <span>${this.taskId}</span>&nbsp;
                ${this.nameLine()}
                <span style="flex-grow: 1"></span>
                <i class="bi-pencil-square" data-toggle="tooltip" title="Edit Task name"
                   @click=${this.setTaskNameToEditable}></i>&nbsp;
                <span class="badge small bg-primary rounded-pill">${this.priority}</span>&nbsp;
                <span class="badge small bg-secondary rounded-pill">${this.formattedCreatedDate()}</span>&nbsp;&nbsp;
                <i class="${(this.done === "true" ? 'bi-x-square' : 'bi-check-square')}" data-toggle="tooltip"
                   title="Set Task to ${(this.done === "true" ? 'undone' : 'done')}" @click=${this.toggleDone}></i>
                &nbsp;
                <i class="bi-trash-fill" data-toggle="tooltip" title="Delete Task" @click=${this.deleteTaskItem}></i>
            </li>
        `;
    }

    setTaskNameToEditable(event) {
        if (this.editName === false) {
            this.editName = true;
            return;
        }
        this.updateName();
    }

    nameKeyEvent(event) {
        this.updateName();
    }

    updateName() {
        let taskNameElement = document.getElementById(`task-${this.taskId}-name`);
        if (taskNameElement.tagName !== 'INPUT' || taskNameElement.value === "") {
            return;
        }
        this.editName = false;
        this.patchTask({'name': taskNameElement.value});
    }

    toggleDone(event) {
        this.patchTask({'done': (this.done !== 'true')});
    }

    patchTask(patchData) {
        fetch(`/tasks/${this.taskId}`, {
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
                if (taskData.name) {
                    this.name = taskData.name;
                }
                if (taskData.done) {
                    this.done = 'true';
                } else {
                    this.done = 'false';
                }
            }).catch(e => console.log(e));
    }

    deleteTaskItem(event) {
        fetch(`/tasks/${this.taskId}`, {
            method: 'DELETE', headers: {
                'Accept': '*/*',
            }
        }).then(response => {
            // Alternative: console.log(this.parentNode);
            window.location.assign(window.location.href);
            this.parentNode.removeChild(this);
        }).catch(e => console.log(e));
    }
}

customElements.define('task-item', TaskItem);
