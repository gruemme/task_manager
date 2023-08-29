import {LitElement} from '/webjars/lit-element/lit-element.js';
import {html} from '/webjars/lit/html.js';

export class NavBar extends LitElement {
    static properties = {
        current: {type: String}
    };

    constructor() {
        super();
        this.current = '';
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
                <div class="container-fluid">
                    <ul class="navbar-nav">
                        <li class="nav-item" id="indexLink">
                            <a class="nav-link ${this.current === 'index.html' ? 'active' : ''}"
                               href="index.html">Tasks</a>
                        </li>
                        <li class="nav-item" id="createLink">
                            <a class="nav-link ${this.current === 'create.html' ? 'active' : ''}" href="create.html">Create
                                Task</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;
    }
}

customElements.define('nav-bar', NavBar);