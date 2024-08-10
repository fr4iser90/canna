# Use the official Nginx image to serve the static files
FROM nginx:latest

# Create necessary directories
RUN mkdir -p /var/log/nginx /var/run /var/lib/nginx/body

# Set permissions for the created directories
RUN chown -R nginx:nginx /var/log/nginx /var/run /var/lib/nginx
RUN chmod -R 755 /var/log/nginx /var/run /var/lib/nginx

# Use a volume to link the static files from the backend
VOLUME /etc/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
