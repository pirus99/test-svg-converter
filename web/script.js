// State management
let currentFile = null;
let originalImage = null;
let convertedBlob = null;
let originalWidth = 0;
let originalHeight = 0;

// DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const controlsSection = document.getElementById('controlsSection');
const originalPreview = document.getElementById('originalPreview');
const convertedPreview = document.getElementById('convertedPreview');
const originalInfo = document.getElementById('originalInfo');
const convertedInfo = document.getElementById('convertedInfo');
const outputFormat = document.getElementById('outputFormat');
const divisorMode = document.getElementById('divisorMode');
const pixelMode = document.getElementById('pixelMode');
const divisorControl = document.getElementById('divisorControl');
const widthControl = document.getElementById('widthControl');
const heightControl = document.getElementById('heightControl');
const aspectRatioControl = document.getElementById('aspectRatioControl');
const divisorInput = document.getElementById('divisor');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const maintainAspect = document.getElementById('maintainAspect');
const qualityGroup = document.getElementById('qualityGroup');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// Event listeners
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
outputFormat.addEventListener('change', handleFormatChange);
divisorMode.addEventListener('change', handleModeChange);
pixelMode.addEventListener('change', handleModeChange);
divisorInput.addEventListener('input', handleDivisorChange);
widthInput.addEventListener('input', handleDimensionChange);
heightInput.addEventListener('input', handleDimensionChange);
qualityInput.addEventListener('input', () => {
    qualityValue.textContent = qualityInput.value;
});
convertBtn.addEventListener('click', convertImage);
downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', reset);

// Helper function to check if file is SVG
function isSVGFile(file) {
    return file.type === 'image/svg+xml' || file.name.endsWith('.svg');
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

// File processing
function processFile(file) {
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg'];
    
    if (!validTypes.includes(file.type) && !isSVGFile(file)) {
        alert('Please upload a valid image file (SVG, PNG, or JPEG)');
        return;
    }

    currentFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
        const content = e.target.result;
        displayOriginalImage(content, file);
        controlsSection.style.display = 'block';
        
        // Set default output format based on input
        if (isSVGFile(file)) {
            outputFormat.value = 'png';
        } else {
            outputFormat.value = 'svg';
        }
        
        handleFormatChange();
        convertedPreview.innerHTML = '<p style="color: var(--text-secondary);">Click "Convert" to see result</p>';
        convertedInfo.textContent = '';
        downloadBtn.style.display = 'none';
    };

    reader.readAsDataURL(file);
}

function displayOriginalImage(dataUrl, file) {
    originalPreview.innerHTML = '';
    
    const img = document.createElement('img');
    img.src = dataUrl;
    img.onload = () => {
        originalImage = img;
        originalWidth = img.naturalWidth;
        originalHeight = img.naturalHeight;
        
        // Set default values based on current mode
        if (divisorMode.checked) {
            const divisor = parseFloat(divisorInput.value) || 4;
            updateDimensionsFromDivisor(divisor);
        } else {
            setDimensionPlaceholders(originalWidth, originalHeight);
        }
    };
    originalPreview.appendChild(img);

    const fileSize = (file.size / 1024).toFixed(2);
    originalInfo.textContent = `${file.name} - ${fileSize} KB - ${originalWidth}×${originalHeight}`;
}

function setDimensionPlaceholders(width, height) {
    widthInput.placeholder = width;
    heightInput.placeholder = height;
}

// Mode change handler
function handleModeChange() {
    if (divisorMode.checked) {
        // Show divisor control, hide pixel controls
        divisorControl.style.display = 'block';
        widthControl.style.display = 'none';
        heightControl.style.display = 'none';
        aspectRatioControl.style.display = 'none';
        
        // Update dimensions based on divisor
        if (originalImage) {
            const divisor = parseFloat(divisorInput.value) || 4;
            updateDimensionsFromDivisor(divisor);
        }
    } else {
        // Show pixel controls, hide divisor control
        divisorControl.style.display = 'none';
        widthControl.style.display = 'block';
        heightControl.style.display = 'block';
        aspectRatioControl.style.display = 'block';
        
        // Set placeholders
        if (originalImage) {
            setDimensionPlaceholders(originalWidth, originalHeight);
        }
    }
}

// Divisor change handler
function handleDivisorChange() {
    if (!divisorMode.checked || !originalImage) return;
    
    const divisor = parseFloat(divisorInput.value);
    if (divisor && divisor > 0) {
        updateDimensionsFromDivisor(divisor);
    }
}

function updateDimensionsFromDivisor(divisor) {
    const newWidth = Math.round(originalWidth / divisor);
    const newHeight = Math.round(originalHeight / divisor);
    widthInput.value = newWidth;
    heightInput.value = newHeight;
    setDimensionPlaceholders(newWidth, newHeight);
}

// Format change handler
function handleFormatChange() {
    const format = outputFormat.value;
    
    // Show quality slider for JPEG
    if (format === 'jpeg') {
        qualityGroup.style.display = 'block';
    } else {
        qualityGroup.style.display = 'none';
    }
}

// Dimension change handler
function handleDimensionChange(e) {
    if (!pixelMode.checked || !maintainAspect.checked || !originalImage) return;

    const aspectRatio = originalWidth / originalHeight;

    if (e.target.id === 'width' && widthInput.value) {
        const newWidth = parseInt(widthInput.value);
        heightInput.value = Math.round(newWidth / aspectRatio);
    } else if (e.target.id === 'height' && heightInput.value) {
        const newHeight = parseInt(heightInput.value);
        widthInput.value = Math.round(newHeight * aspectRatio);
    }
}

// Conversion logic
async function convertImage() {
    if (!currentFile || !originalImage) {
        alert('Please upload an image first');
        return;
    }

    convertBtn.classList.add('loading');
    convertBtn.textContent = 'Converting...';

    try {
        const format = outputFormat.value;
        let width, height;
        
        if (divisorMode.checked) {
            const divisor = parseFloat(divisorInput.value) || 4;
            width = Math.round(originalWidth / divisor);
            height = Math.round(originalHeight / divisor);
        } else {
            width = parseInt(widthInput.value) || originalWidth;
            height = parseInt(heightInput.value) || originalHeight;
        }

        if (format === 'svg') {
            await convertToSVG(width, height);
        } else {
            await convertToRaster(format, width, height);
        }

        downloadBtn.style.display = 'block';
    } catch (error) {
        console.error('Conversion error:', error);
        alert('Conversion failed. Please try again.');
    } finally {
        convertBtn.classList.remove('loading');
        convertBtn.textContent = 'Convert';
    }
}

async function convertToRaster(format, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Set white background for JPEG
    if (format === 'jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
    }

    // Draw image on canvas
    ctx.drawImage(originalImage, 0, 0, width, height);

    // Convert to blob
    const quality = parseInt(qualityInput.value) / 100;
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    
    convertedBlob = await new Promise(resolve => {
        canvas.toBlob(resolve, mimeType, quality);
    });

    // Display converted image
    const url = URL.createObjectURL(convertedBlob);
    const img = document.createElement('img');
    img.src = url;
    convertedPreview.innerHTML = '';
    convertedPreview.appendChild(img);

    const fileSize = (convertedBlob.size / 1024).toFixed(2);
    convertedInfo.textContent = `${width}×${height} - ${fileSize} KB - ${format.toUpperCase()}`;
}

async function convertToSVG(width, height) {
    // Create SVG from raster image
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const image = document.createElementNS(svgNS, "image");
    image.setAttribute("width", width);
    image.setAttribute("height", height);
    image.setAttribute("href", originalImage.src);

    svg.appendChild(image);

    // Convert SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    
    // Create blob
    convertedBlob = new Blob([svgString], { type: 'image/svg+xml' });

    // Display converted SVG
    const url = URL.createObjectURL(convertedBlob);
    const img = document.createElement('img');
    img.src = url;
    convertedPreview.innerHTML = '';
    convertedPreview.appendChild(img);

    const fileSize = (convertedBlob.size / 1024).toFixed(2);
    convertedInfo.textContent = `${width}×${height} - ${fileSize} KB - SVG`;
}

// Download functionality
function downloadImage() {
    if (!convertedBlob) {
        alert('Please convert the image first');
        return;
    }

    const format = outputFormat.value;
    const originalName = currentFile.name.split('.')[0];
    const filename = `${originalName}_converted.${format}`;

    const url = URL.createObjectURL(convertedBlob);
    try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } finally {
        URL.revokeObjectURL(url);
    }
}

// Reset functionality
function reset() {
    currentFile = null;
    originalImage = null;
    convertedBlob = null;
    originalWidth = 0;
    originalHeight = 0;
    
    fileInput.value = '';
    originalPreview.innerHTML = '';
    convertedPreview.innerHTML = '';
    originalInfo.textContent = '';
    convertedInfo.textContent = '';
    widthInput.value = '';
    heightInput.value = '';
    widthInput.placeholder = 'Auto';
    heightInput.placeholder = 'Auto';
    divisorInput.value = '4';
    divisorMode.checked = true;
    handleModeChange();
    
    controlsSection.style.display = 'none';
    downloadBtn.style.display = 'none';
}
