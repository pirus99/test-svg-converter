# SVG Converter 🎨

A beautiful, modern web-based image converter that runs entirely in your browser. Convert between SVG, PNG, and JPEG formats with optional dimension adjustments - all without uploading your files to any server!

## Features ✨

- **Client-Side Conversion**: All processing happens in your browser - no backend required, ensuring privacy and speed
- **Multiple Format Support**: Convert between SVG, PNG, and JPEG formats
- **Dimension Control**: Optionally adjust width and height with aspect ratio preservation
- **Quality Control**: Adjust JPEG compression quality
- **Dark Theme UI**: Beautiful, intuitive dark-themed interface
- **Drag & Drop**: Easy file upload with drag-and-drop support
- **Real-time Preview**: See original and converted images side by side
- **Docker Compose**: One-command deployment with Docker Compose

## Quick Start 🚀

### Prerequisites

- Docker
- Docker Compose

### Installation & Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/pirus99/test-svg-converter.git
   cd test-svg-converter
   ```

2. Start the application:
   ```bash
   docker-compose up -d
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

4. Start converting your images!

### Stop the application:
```bash
docker-compose down
```

## How to Use 📖

1. **Upload**: Drag and drop your image file or click "Browse Files" to select an image (SVG, PNG, or JPEG)
2. **Configure**: 
   - Choose output format (PNG, SVG, or JPEG)
   - Optionally set custom width/height
   - For JPEG, adjust quality slider
3. **Convert**: Click the "Convert" button to process your image
4. **Download**: Click "Download" to save the converted image

## Technical Details 🔧

### Architecture

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Server**: Nginx (Alpine Linux)
- **Container**: Docker with Docker Compose orchestration

### How It Works

The application uses HTML5 Canvas API to perform all conversions client-side:

- **SVG to PNG/JPEG**: Renders SVG on a canvas element and exports as raster format
- **PNG/JPEG to SVG**: Embeds the raster image inside an SVG element
- **Dimension Adjustment**: Canvas scaling with aspect ratio preservation
- **Quality Control**: Canvas toBlob API with quality parameter

### File Structure

```
test-svg-converter/
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker image definition
├── nginx.conf              # Nginx server configuration
├── web/                    # Web application files
│   ├── index.html          # Main HTML structure
│   ├── styles.css          # Dark theme styling
│   └── script.js           # Conversion logic
└── README.md               # This file
```

## Privacy & Security 🔒

- **No Data Upload**: All conversions happen in your browser using JavaScript
- **No Server Processing**: The nginx server only serves static files
- **No Tracking**: No analytics or tracking scripts
- **HTTPS Ready**: Configure SSL certificates in nginx.conf for production use

## Browser Compatibility 🌐

The application works in all modern browsers that support:
- HTML5 Canvas API
- FileReader API
- Blob API
- ES6 JavaScript

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Customization 🎨

### Change Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

### Theme Customization

Edit `web/styles.css` and modify CSS variables:
```css
:root {
    --bg-primary: #0f0f23;
    --accent-primary: #0f4c75;
    /* ... other variables */
}
```

## Development 💻

### Running Locally Without Docker

You can serve the `web` directory with any static file server:

```bash
cd web
python -m http.server 8080
```

Then open http://localhost:8080

### Building the Docker Image

```bash
docker build -t svg-converter .
docker run -p 8080:80 svg-converter
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.

## Support 💬

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for the community
