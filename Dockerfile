FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy web application files
COPY web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
