import './details.css';

export function popupDetails(cardInstance) {
    const el = cardInstance.el;

    if (el !== cardInstance.cardState.button) {
        el
            .querySelector('.card__image')
            .addEventListener('click', () => {
                const rootElement = document.querySelector('.rootC');
                const popup = document.createElement('div');
                popup.classList.add('popup');
                popup.innerHTML = `
                    <div class="details__image">
                            <img src="${cardInstance.cardState.Poster !== 'N/A' ? cardInstance.cardState.Poster : 'path/to/default/poster.jpg'}" alt="${cardInstance.cardState.Title} Poster">
                    </div>
                    <div class="details__info">
                        <div class="details__title">Title: ${cardInstance.cardState.Title}</div>
                        <div class="details__type">Type: ${cardInstance.cardState.Type}</div>
                        <div class="details__genre">Genre: ${cardInstance.cardState.Genre}</div>
                        <div class="details__actors">Actors: ${cardInstance.cardState.Actors}</div>
                        <div class="details__description">Description: ${cardInstance.cardState.Plot}</div>
                        <div class="details__year">Year: ${cardInstance.cardState.Year}</div>
                        <button class="popup-close">Close</button>
                    </div>`;

                popup
                    .querySelector('.popup-close')
                    .addEventListener('click', () => {
                        popup.remove();
                    });

                document.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape' || event.key === 'Enter' || event.key === 'Backspace') {
                        popup.remove();
                        document.removeEventListener('click', this);
                        document.removeEventListener('keydown', this);
                    }
                });

                rootElement.insertAdjacentElement('afterend', popup);
            });
    }
}