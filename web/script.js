// State management
let currentFile = null;
let originalImage = null;
let convertedBlob = null;

// DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const controlsSection = document.getElementById('controlsSection');
const originalPreview = document.getElementById('originalPreview');
const convertedPreview = document.getElementById('convertedPreview');
const originalInfo = document.getElementById('originalInfo');
const convertedInfo = document.getElementById('convertedInfo');
const outputFormat = document.getElementById('outputFormat');
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
        setDimensionPlaceholders(img.naturalWidth, img.naturalHeight);
    };
    originalPreview.appendChild(img);

    const fileSize = (file.size / 1024).toFixed(2);
    originalInfo.textContent = `${file.name} - ${fileSize} KB`;
}

function setDimensionPlaceholders(width, height) {
    widthInput.placeholder = width;
    heightInput.placeholder = height;
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
    if (!maintainAspect.checked || !originalImage) return;

    const originalWidth = originalImage.naturalWidth;
    const originalHeight = originalImage.naturalHeight;
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
        const width = parseInt(widthInput.value) || originalImage.naturalWidth;
        const height = parseInt(heightInput.value) || originalImage.naturalHeight;

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
    
    fileInput.value = '';
    originalPreview.innerHTML = '';
    convertedPreview.innerHTML = '';
    originalInfo.textContent = '';
    convertedInfo.textContent = '';
    widthInput.value = '';
    heightInput.value = '';
    widthInput.placeholder = 'Auto';
    heightInput.placeholder = 'Auto';
    
    controlsSection.style.display = 'none';
    downloadBtn.style.display = 'none';
}
