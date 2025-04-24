#!/bin/bash

# Set variables
EC2_HOST="34.205.144.114"
APP_DIR="/var/www/web_app"
KEY_PATH="~/.ssh/cloud_web_app.pem"

# Build the application
npm run build

# Deploy to EC2
scp -i $KEY_PATH -r \
    ./dist \
    ./server.js \
    ./package.json \
    ./ecosystem.config.cjs \
    ubuntu@$EC2_HOST:$APP_DIR/

# SSH and setup
ssh -i $KEY_PATH ubuntu@$EC2_HOST << 'EOF'
    cd /var/www/web_app
    npm install --production
    pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs
    pm2 save
EOF