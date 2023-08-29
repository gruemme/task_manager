import {LitElement} from '/webjars/lit-element/lit-element.js';
import {html} from '/webjars/lit/html.js';

// import {ifDefined} from '/webjars/lit/directive.js';


export class TaskList extends LitElement {
    static properties = {
        content: {state: true}, currentPage: {state: true}
    };

    constructor() {
        super();
        this.content = html`<p>No items available</p>`;
        this.currentPage = this.getPageParamOrZero();
        this.fetchData(this.currentPage);
    }

    getPageParamOrZero() {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.has('page') ? queryParams.get('page') : 0;
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div id="content">${this.content}</div>
        `;
    }

    fetchData(page) {
        fetch(`/tasks?page=${page}`)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then((data) => this.renderTasksList(data, page))
            .catch(e => console.log(e));
    }

    renderTasksList(data, page) {
        if (data.content.length === 0) {
            return;
        }
        this.content = html`
            <div>
                <ul class="list-group">
                    ${data.content.map((taskData) => this.renderTaskItem(taskData))}
                </ul>
            </div>
            ${this.renderPagination(data, page)}`;
    }

    renderTaskItem(taskData) {
        return html`
            <task-item taskId="${taskData.id}" name="${taskData.name}" done="${taskData.done}"
                       priority="${taskData.priority}" created="${taskData.created}"></task-item>`
    }

    renderPagination(data, currentPage) {
        if (data.totalPages <= 1) {
            return html``;
        }
        const arr = Array.from({length: data.totalPages}, (e, i) => i)
        return html`
            <nav aria-label="Page navigation example">
                <ul class="mt-3 pagination justify-content-center">
                    <li class="page-item ${data.first ? 'disabled' : ''}">
                        <a class="page-link" href="index.html?page=${(currentPage - 1)}">Previous</a>
                    </li>
                    ${arr.map((i) => html`
                        <li class="page-item">
                            <a class="page-link ${i == currentPage ? 'disabled' : ''}" href="index.html?page=${i}">
                                ${i + 1}
                            </a>
                        </li>`)}
                    <li class="page-item ${data.last ? 'disabled' : ''}"
                    ">
                    <a class="page-link" href="index.html?page=${(+currentPage + 1)}">Next</a>
                    </li>
                </ul>
            </nav>`;
    }
}

customElements.define('task-list', TaskList);
