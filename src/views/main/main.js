import {AbstractView} from "../../common/view.js";
import {Header} from "../../components/header/header.js";
import {Search} from "../../components/search/search.js";

import onChange from "on-change";
import {CardList} from "../../components/card-list/card-list.js";

export class mainView extends AbstractView {
    state = {
        list: [],
        totalResults: 0,
        loading: false,
        searchQuery: undefined,
        currentPage: 1,
        totalPages: 0,
        resultsPerPage: 12,
    };

    constructor(appState) {
        super();
        this.appState = appState;
        this.appState = onChange(this.appState, this.appStateHook.bind(this));
        this.state = onChange(this.state, this.stateHook.bind(this));
        this.setTitle('Movie Library');
    }

    destroy() {
        onChange.unsubscribe(this.appState);
        onChange.unsubscribe(this.state);
    }

    appStateHook(path) {
        if (path === 'favourites') {
            this.render();
        }
    }

    async stateHook(path) {
        if (path === 'searchQuery' || path === 'currentPage') {
            this.state.loading = true;
            const data = await this.loadList(this.state.searchQuery, this.state.currentPage);
            this.state.loading = false;
            this.state.totalResults = data.totalResults;
            this.state.totalPages = Math.ceil(data.totalResults / this.state.resultsPerPage);
            this.state.list = data["Search"];
        }
        if (path === 'list' || path === 'loading') {
            this.render();
        }
    }

    async loadList(name, page) {
        const res = await fetch(`https://www.omdbapi.com/?s=${name}&page=${page}&apikey=98d8bb42`);
        const data = await res.json();

        const startIndex = (page - 1) * this.state.resultsPerPage;
        let finalResults = data.Search || [];

        if (this.state.resultsPerPage > 10) {
            const additionalRequests = Math.ceil((this.state.resultsPerPage - 10) / 10);
            for (let i = 1; i <= additionalRequests; i++) {
                const additionalPage = page + i;
                const additionalRes = await fetch(`https://www.omdbapi.com/?s=${name}&page=${additionalPage}&apikey=98d8bb42`);
                const additionalData = await additionalRes.json();
                finalResults = finalResults.concat(additionalData.Search || []);
            }
        }

        return {
            totalResults: data.totalResults,
            Search: finalResults.slice(0, this.state.resultsPerPage)
        };
    }

    render() {
        const main = document.createElement('div');
        main.innerHTML = `<h1>Found movies - ${this.state.totalResults}</h1>`;
        main.append(new Search(this.state).render());
        main.append(new CardList(this.appState, this.state).render());
        this.app.innerHTML = '';
        this.app.append(main);
        this.renderHeader();
        this.renderPagination();
    }

    renderHeader() {
        const header = new Header(this.appState).render();
        this.app.prepend(header);
    }

    renderPagination() {
        const pagination = document.createElement('div');
        pagination.classList.add('pagination');

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = this.state.currentPage === 1;
        prevButton.onclick = () => {
            if (this.state.currentPage > 1) {
                this.state.currentPage -= 1;
            }
        };

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = this.state.currentPage === this.state.totalPages;
        nextButton.onclick = () => {
            if (this.state.currentPage < this.state.totalPages) {
                this.state.currentPage += 1;
            }
        };

        pagination.append(prevButton, nextButton);
        this.app.append(pagination);
    }
}