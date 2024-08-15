import {AbstractView} from "../../common/view.js";
import {Header} from "../../components/header/header.js";

import onChange from "on-change";
import {CardList} from "../../components/card-list/card-list.js";

export class FavouritesView extends AbstractView {

    constructor(appState) {
        super();
        this.appState = appState;
        this.appState = onChange(this.appState, this.appStateHook.bind(this));
        this.setTitle('My films');
    }

    destroy() {
        onChange.unsubscribe(this.appState);
    }

    appStateHook(path) {
        if (path === 'favourites') {
            this.render();
        }
    }

    render() {
        const main = document.createElement('div');
        main.innerHTML = `<h1>My favourite movies - ${this.appState.favourites.length}</h1>`;
        main.append(new CardList(this.appState, {list: this.appState.favourites}).render());
        this.app.innerHTML = '';
        this.app.append(main);
        this.renderHeader();
    }

    renderHeader() {
        const header = new Header(this.appState).render();
        this.app.prepend(header);
    }
}