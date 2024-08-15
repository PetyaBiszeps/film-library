import {DivComponent} from "../../common/div-component.js";

import './header.css';

export class Header extends DivComponent {
    constructor(appState) {
        super();
        this.appState = appState;
    }

    render() {
        this.el.innerHTML = '';
        this.el.classList.add('header');
        this.el.innerHTML = `
            <div>
                <img src="/static/movie-logo.svg" alt="logo" id="main-logo"/>
            </div>
            <div class="menu">
                <a href="#" class="menu__item">
                    <img src="/static/search.svg" alt="search-icon" />
                    Search
                </a>
                <a href="#favourites" class="menu__item">
                    <img src="/static/favorites.svg" alt="favourites-icon" />
                    Favourites
                    <div class="menu__counter">
                        ${this.appState.favourites.length}
                    </div>
                </a>
            </div>
        `;
        return this.el;
    }
}