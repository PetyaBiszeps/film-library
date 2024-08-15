import {mainView} from "./views/main/main.js";
import {FavouritesView} from "./views/favourites/favourites.js";

class app {
    routes = [
        {path: "", view: mainView},
        {path: "#favourites", view: FavouritesView}
    ];

    appState = {
        favourites: []
    };

    constructor() {
        window.addEventListener('hashchange', this.route.bind(this));
        this.route();
    }

    route() {
        if (this.currentView) {
            this.currentView.destroy();
        }
        const view = this.routes.find(r => r.path === location.hash).view;
        this.currentView = new view(this.appState);
        this.currentView.render();
    }
}

new app();