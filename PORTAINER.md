# Portainer Deployment Guide

This guide provides detailed instructions for deploying the SVG Converter application using Portainer.

## Prerequisites

- Portainer CE or EE installed and running
- Access to Portainer web interface
- Docker installed on your host

## Deployment Methods

### Method 1: Git Repository Stack (Recommended)

This method automatically pulls the configuration from GitHub.

#### Steps:

1. **Login to Portainer**
   - Navigate to your Portainer instance (e.g., `https://your-server:9443`)
   - Login with your credentials

2. **Create New Stack**
   - Go to **Stacks** in the left sidebar
   - Click **+ Add stack** button

3. **Configure Stack**
   - **Name**: `svg-converter` (or your preferred name)
   - **Build method**: Select **Git Repository**

4. **Git Configuration**
   - **Repository URL**: `https://github.com/pirus99/test-svg-converter`
   - **Repository reference**: `refs/heads/main`
   - **Compose path**: `docker-compose.yml`
   - Leave authentication empty (public repository)

5. **Environment Variables** (Optional - click "+ add environment variable" for each)
   
   | Name | Value | Description |
   |------|-------|-------------|
   | `APP_PORT` | `8080` | Port to access the application |
   | `TZ` | `UTC` | Container timezone |

6. **Deploy**
   - Scroll down and click **Deploy the stack**
   - Wait for the build and deployment to complete

7. **Access Application**
   - Open your browser to `http://your-server-ip:8080`
   - Replace `8080` with your `APP_PORT` if changed

### Method 2: Web Editor Stack

If you prefer to paste the configuration directly:

1. **Create New Stack**
   - Go to **Stacks** → **+ Add stack**

2. **Configure Stack**
   - **Name**: `svg-converter`
   - **Build method**: Select **Web editor**

3. **Paste Configuration**
   
   Copy and paste the following into the editor:

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

4. **Add Environment Variables** (same as Method 1)

5. **Deploy the stack**

**Note:** For Web Editor method, you'll need to upload or have the web files available. The Git Repository method is recommended as it automatically pulls all needed files.

### Method 3: Custom Template (For Repeated Deployments)

Create a reusable template for easy deployment:

1. **Navigate to App Templates**
   - Go to **App Templates** in the left sidebar
   - Click **Custom Templates**
   - Click **+ Add Custom Template**

2. **Template Configuration**
   - **Title**: `SVG Converter`
   - **Description**: `Browser-based image converter supporting SVG, PNG, and JPEG formats with client-side conversion`
   - **Note**: `All conversions happen in the browser. No data is uploaded to the server.`
   - **Platform**: Select **Linux**
   - **Type**: Select **Stack (Compose)**
   - **Repository**: Use Git repository option with `https://github.com/pirus99/test-svg-converter`

3. **Environment Variables**
   
   Add default environment variables:
   - `APP_PORT` with default value `8080`
   - `TZ` with default value `UTC`

4. **Save Template**
   - Click **Create custom template**

5. **Deploy from Template**
   - Go back to **App Templates**
   - Find your "SVG Converter" template
   - Click on it and fill in any custom values
   - Deploy

## Configuration Options

### Port Configuration

The application exposes port 80 internally. You can map it to any port on your host using the `APP_PORT` environment variable:

- **Default**: `8080` → Access at `http://your-server:8080`
- **Custom**: Set `APP_PORT=3000` → Access at `http://your-server:3000`

### Timezone

Set the container timezone using the `TZ` environment variable:
- Examples: `America/New_York`, `Europe/London`, `Asia/Tokyo`

## Updating the Application

### For Git Repository Stack:

1. Go to **Stacks** in Portainer
2. Find your `svg-converter` stack
3. Click on the stack name
4. Click **Pull and redeploy**
5. Confirm the redeployment

This will pull the latest code from GitHub and rebuild the container.

### For Web Editor Stack:

1. Go to **Stacks**
2. Find your stack
3. Click **Editor**
4. Click **Update the stack**
5. Enable **Re-pull image and redeploy** checkbox
6. Click **Update**

## Troubleshooting

### Container Won't Start

1. Check the container logs in Portainer:
   - Go to **Containers**
   - Click on the `svg-converter` container
   - View **Logs** tab

2. Common issues:
   - Port already in use: Change `APP_PORT` to a different port
   - Git clone failed: Check if the repository URL is accessible
   - Build failed: Check if Docker has internet access

### Can't Access the Application

1. Check if the container is running:
   - Go to **Containers** in Portainer
   - Verify `svg-converter` shows **running** status

2. Check port mapping:
   - Click on the container
   - Go to **Port mapping** section
   - Verify the external port matches your `APP_PORT`

3. Test locally first:
   ```bash
   curl http://localhost:8080
   ```

4. Check firewall rules:
   - Ensure the port is open on your host firewall
   - For cloud instances, check security group rules

### Application Not Updating

If you made changes to the repository but they're not reflected:

1. Force rebuild in Portainer:
   - Delete the stack
   - Redeploy it
   
2. Or use Docker CLI:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

## Security Considerations

### Network Isolation

For production deployments, consider:

1. **Reverse Proxy**: Use Traefik, Nginx Proxy Manager, or Caddy
2. **HTTPS**: Enable SSL/TLS certificates
3. **Network**: Create a dedicated Docker network

Example with Traefik labels in docker-compose.yml:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.svg-converter.rule=Host(`converter.yourdomain.com`)"
  - "traefik.http.routers.svg-converter.entrypoints=websecure"
  - "traefik.http.routers.svg-converter.tls.certresolver=letsencrypt"
```

### Resource Limits

Add resource constraints to prevent excessive resource usage:

```yaml
services:
  web:
    # ... existing configuration ...
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

## Monitoring

### Health Check

Add a health check to monitor application status:

```yaml
services:
  web:
    # ... existing configuration ...
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### View Metrics in Portainer

1. Go to **Containers**
2. Click on `svg-converter`
3. View **Stats** tab for CPU, memory, and network usage

## Support

For issues or questions:
- GitHub Issues: https://github.com/pirus99/test-svg-converter/issues
- Check container logs in Portainer
- Verify environment variables are set correctly

## Additional Resources

- [Portainer Documentation](https://docs.portainer.io/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Project README](./README.md)
