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
- Docker Compose (for local deployment) OR Portainer (for Portainer deployment)

### Option 1: Local Docker Compose Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/pirus99/test-svg-converter.git
   cd test-svg-converter
   ```

2. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env to customize APP_PORT and other settings
   ```

3. Start the application:
   ```bash
   docker-compose up -d
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```
   (or your configured APP_PORT)

5. Start converting your images!

### Stop the application:
```bash
docker-compose down
```

### Option 2: Portainer Deployment (Recommended for Easy Management)

Portainer makes it easy to deploy and manage this application with a web interface.

#### Using Portainer Stacks:

1. Open your Portainer instance
2. Navigate to **Stacks** → **Add Stack**
3. Name your stack (e.g., "svg-converter")
4. Choose **Git Repository** as the build method
5. Configure:
   - **Repository URL**: `https://github.com/pirus99/test-svg-converter`
   - **Repository Reference**: `refs/heads/main` (or your branch)
   - **Compose Path**: `docker-compose.yml`
6. Set **Environment Variables** (optional):
   ```
   APP_PORT=8080
   TZ=UTC
   ```
7. Click **Deploy the stack**
8. Access the application at `http://your-server-ip:8080`

#### Using Portainer Web Editor:

If you prefer to paste the configuration directly:

1. **Create New Stack**
   - Go to **Stacks** → **+ Add stack**
2. **Configure Stack**
   - **Name**: `svg-converter`
   - **Build method**: Select **Web editor**
3. **Paste Configuration**
   
   Copy and paste the docker-compose.yml:
   ```yaml
   services:
     web:
       build:
         context: .
       image: svg-converter:latest
       container_name: svg-converter
       ports:
         - "${APP_PORT:-8080}:80"
       restart: unless-stopped
       environment:
         - TZ=${TZ:-UTC}
   ```

4. **Add Environment Variables**
   - `APP_PORT` with default value `8080`
   - `TZ` with default value `UTC`
5. **Deploy the stack**

#### Using Pre-built Image (Easiest):

For the simplest deployment without building from source:

1. Pull the image (once built and pushed to a registry):
   ```yaml
   services:
     web:
       image: your-registry/svg-converter:latest
       container_name: svg-converter
       ports:
         - "${APP_PORT:-8080}:80"
       restart: unless-stopped
       environment:
         - TZ=${TZ:-UTC}
   ```

#### Environment Variables for Portainer:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | `8080` | Port on which the application will be accessible |
| `TZ` | `UTC` | Container timezone |

**Benefits of Portainer Deployment:**
- ✅ Easy port configuration through web UI
- ✅ Simple stack deployment from Git
- ✅ Container management and monitoring
- ✅ Web-based configuration
- ✅ One-click updates by redeploying the stack

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
├── docker-compose.yml      # Docker Compose configuration with env vars
├── Dockerfile              # Docker image definition (builds from Git)
├── nginx.conf              # Nginx server configuration
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── web/                    # Web application files (pulled from Git during build)
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

**Using Environment Variable (Recommended):**
```bash
# Create or edit .env file
echo "APP_PORT=3000" > .env
docker-compose up -d
```

**Or edit `docker-compose.yml` directly:**
```yaml
ports:
  - "3000:80"  # Change 3000 to your desired port
```

**In Portainer:**
Set the `APP_PORT` environment variable in the stack configuration.

### Theme Customization

To customize the theme, fork the repository and modify `web/styles.css` CSS variables:

```css
:root {
    --bg-primary: #0f0f23;
    --accent-primary: #0f4c75;
    /* ... other variables */
}
```

Then deploy your forked repository using Portainer's Git Repository option.

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
