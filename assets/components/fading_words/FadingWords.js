class FadingWords extends HTMLElement {
    static get observedAttributes() {
        return ['words'];
    }

    constructor() {
        super();
        this._words = [];
        this._queue = [];
        this.attachShadow({ mode: 'open' });
        this.addStyles();
    }

    connectedCallback() {
        this.processWords();
        this.startWordCycle();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'words') {
            this._words = newValue.split(',');
            this.processWords();
        }
    }

    processWords() {
        this._words.forEach(word => {
            const wordElement = this.createWordElement(word);
            this.shadowRoot.appendChild(wordElement);
            this._queue.push(wordElement);
        });
    }

    createWordElement(word) {
        const container = document.createElement('div');
        container.className = 'word-container';
        container.textContent = word;
        this.positionWord(container);
        return container;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .word-container {
                position: absolute;
                font-size: 40px;
                opacity: 0;
                transition: opacity 2s;
                z-index: 9999;
                color: white;
                font-family: 'Montserrat', sans-serif;
                font-weight: bold;
            }
            .fade-in {
                opacity: 1;
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    startWordCycle() {
        this.intervalId = setInterval(() => {
            const currentWordElement = this._queue.shift();
            currentWordElement.classList.add('fade-in');

            // Remove the element after it fades out
            setTimeout(() => {
                currentWordElement.classList.remove('fade-in');
                setTimeout(() => currentWordElement.remove(), 3000);
            }, 2000);

            // Add the element back to the end of the queue
            this._queue.push(currentWordElement);
        }, 4000);
    }

    positionWord(container) {
        const maxLeft = window.innerWidth - container.offsetWidth;
        const maxTop = window.innerHeight - container.offsetHeight;
        const x = Math.random() * maxLeft;
        const y = Math.random() * (maxTop - 80) + 80;
        container.style.left = x + 'px';
        container.style.top = y + 'px';
    }
}

customElements.define('fading-words', FadingWords);
