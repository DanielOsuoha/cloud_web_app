#!/bin/bash

# Set variables
EC2_HOST="34.205.144.114"
APP_DIR="/var/www/web_app"
KEY_PATH="$HOME/Downloads/cloud_web_app.pem"  # Update this to where you downloaded the key

# Build and deploy
echo "🏗️  Building application..."
npm run build

echo "📦 Deploying to EC2..."
scp -i $KEY_PATH -r \
    ./dist \
    ./server.js \
    ./package.json \
    ./ecosystem.config.cjs \
    ubuntu@$EC2_HOST:$APP_DIR/

echo "🚀 Starting application..."
ssh -i $KEY_PATH ubuntu@$EC2_HOST << 'EOF'
    cd /var/www/web_app
    npm install --production
    pm2 delete all || true
    pm2 start ecosystem.config.cjs
    pm2 save
EOF

echo "✅ Deployment complete!"