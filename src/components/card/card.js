import {DivComponent} from "../../common/div-component.js";

import './card.css';

export class Card extends DivComponent {
    constructor(appState, cardState) {
        super();
        this.appState = appState;
        this.cardState = cardState;
    }

    #addToFavourites() {
        this.appState.favourites.push(this.cardState);
    }

    #deleteFromFavourites() {
        this.appState.favourites = this.appState.favourites.filter(f => f.imdbID !== this.cardState.imdbID);
    }

    render() {
        this.el.classList.add('card');
        const existInFavourites = this.appState.favourites.find(f => f.imdbID === this.cardState.imdbID);
        this.el.innerHTML = `<div class="card__image">
                                <img src="${this.cardState.Poster !== 'N/A' ? this.cardState.Poster : 'path/to/default/poster.jpg'}" alt="${this.cardState.Title} Poster">
                            </div>
                            <div class="card__info">
                                <div class="card__type">Type: ${this.cardState.Type}</div>
                                <div class="card__title">Title: ${this.cardState.Title}</div>
                                <div class="card__year">Year: ${this.cardState.Year}</div>
                                <button class="button__add ${existInFavourites ? 'button__active' : ''}">
                                    ${existInFavourites ? '<img src="static/favorite-black.svg" alt="fb"/>' : '<img src="static/favorite-white.svg" alt="fw"/>'}
                                </button>
                            </div>`;
        if (existInFavourites) {
            this.el
                .querySelector('button')
                .addEventListener('click', this.#deleteFromFavourites.bind(this));
        } else {
            this.el
                .querySelector('button')
                .addEventListener('click', this.#addToFavourites.bind(this));
        }
        console.log(existInFavourites);
        return this.el;
    }
}