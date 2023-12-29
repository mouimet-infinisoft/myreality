class MicAccessWarning extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Warning message and button
        const container = document.createElement('div');
        container.setAttribute('class', 'container');
        container.innerHTML = `
            <div class="warning">
                <p>This website requires continuous microphone access. Please click 'Agree' to continue.</p>
                <button id="agreeButton">Agree</button>
            </div>
        `;

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .warning {
                text-align: center;
                color: white;
                max-width: 600px;
                padding: 20px;
                background: #333;
                border-radius: 10px;
            }
            button {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 5px;
            }
        `;

        // Append the elements
        this.shadowRoot.append(style, container);

        // Button functionality
        this.shadowRoot.getElementById('agreeButton').addEventListener('click', () => {
            // Implement functionality to enable the microphone
            this.shadowRoot.querySelector('.container').style.display = 'none';
        });
    }
}

customElements.define('mic-access-warning', MicAccessWarning);
