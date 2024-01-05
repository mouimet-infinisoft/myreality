class ImageRotator extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.rotation = 0;
        this.isRotating = false;
        this.rotationSpeed = 1; // Default rotation speed
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.loadDefaultImage();
    }

    static get observedAttributes() {
        return ['title', 'default-image'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            this.shadow.querySelector('#title').textContent = newValue;
        }
        if (name === 'default-image' && this.image) {
            this.setImageSrc(newValue);
        }
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    text-align: center;
                }
                #imageContainer {
                    width: 100%;
                    height: 340px; /* Adjusted height to accommodate rotating image */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 20px 0;
                }
                img {
                    max-width: 300px; 
                    max-height: 300px;
                    display: block;
                }
                #controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    margin-top: 15px;
                }
                #filePicker {
                    margin-top: 15px;
                }
            </style>
            <h2 id="title">${this.getAttribute('title') || 'Image Rotator'}</h2>
            <div id="imageContainer">
                <img id="image" style="display: none;">
            </div>
            <div id="controls">
                <button id="startStopButton">Start</button>
                <input type="range" id="speedSlider" min="0" max="100" value="0">
                <span id="speedValue">0</span>
            </div>
            <input type="file" id="imageInput" accept="image/*" id="filePicker">
        `;
    }

    attachEventListeners() {
        this.imageInput = this.shadow.getElementById('imageInput');
        this.image = this.shadow.getElementById('image');
        this.startStopButton = this.shadow.getElementById('startStopButton');
        this.speedSlider = this.shadow.getElementById('speedSlider');
        this.speedValue = this.shadow.getElementById('speedValue');

        this.imageInput.addEventListener('change', this.handleImageChange.bind(this));
        this.startStopButton.addEventListener('click', this.toggleRotation.bind(this));
        this.speedSlider.addEventListener('input', this.adjustSpeed.bind(this));
        this.rotationSpeed = parseInt(this.speedSlider.value, 10);
    }

    loadDefaultImage() {
        const defaultImageUrl = this.getAttribute('default-image');
        if (defaultImageUrl) {
            this.setImageSrc(defaultImageUrl);
        }
    }

    setImageSrc(imageUrl) {
        this.image.src = imageUrl;
        this.image.style.display = 'block';
    }

    handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.image.src = URL.createObjectURL(file);
            this.image.style.display = 'block';
        }
    }

    toggleRotation() {
        this.isRotating = !this.isRotating;
        this.startStopButton.textContent = this.isRotating ? 'Stop' : 'Start';
        this.rotateImage();
    }

    adjustSpeed(event) {
        this.rotationSpeed = parseInt(event.target.value, 10);
        this.speedValue.textContent = this.rotationSpeed;
    }

    rotateImage() {
        if (this.isRotating) {
            this.rotation = (this.rotation + this.rotationSpeed) % 360;
            this.image.style.transform = `rotate(${this.rotation}deg)`;
            requestAnimationFrame(this.rotateImage.bind(this));
        }
    }
}

customElements.define('image-rotator', ImageRotator);
