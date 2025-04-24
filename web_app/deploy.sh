#!/bin/bash

# Set variables
EC2_HOST="34.205.144.114"
APP_DIR="/var/www/web_app"
KEY_PATH="$HOME/.ssh/cloud_web_app.pem"

# Initial setup
echo "🛠️  Setting up EC2 environment..."
ssh -tt -i $KEY_PATH ubuntu@$EC2_HOST << 'EOF'
    # Update system packages
    sudo apt update
    
    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # Install PM2 if not present
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
    
    # Create directory structure
    sudo mkdir -p /var/www/web_app/src/models
    sudo chown -R ubuntu:ubuntu /var/www/web_app
    exit
EOF

# Build and deploy
echo "🏗️  Building application..."
npm run build

echo "📦 Deploying to EC2..."
scp -i $KEY_PATH -r \
    ./dist \
    ./server.js \
    ./package.json \
    ./ecosystem.config.cjs \
    ./src/models/Post.js \
    ./src/models/User.js \
    ubuntu@$EC2_HOST:$APP_DIR/

# Create directory structure on EC2
ssh -i $KEY_PATH ubuntu@$EC2_HOST "mkdir -p $APP_DIR/src/models"

# Copy model files
scp -i $KEY_PATH -r \
    ./src/models/* \
    ubuntu@$EC2_HOST:$APP_DIR/src/models/

echo "🚀 Starting application..."
ssh -tt -i $KEY_PATH ubuntu@$EC2_HOST << 'EOF'
    cd /var/www/web_app
    npm install --omit=dev
    pm2 delete all || true
    pm2 start ecosystem.config.cjs
    pm2 save
    pm2 startup
    
    # Verify deployment
    echo "\n🔍 Checking deployment status..."
    sleep 5  # Wait for server to start
    curl -s http://localhost:5000/api/posts || echo "❌ API failed to respond"
    
    # Show PM2 status
    echo "\n📊 PM2 Process Status:"
    pm2 list
    exit
EOF

echo "✅ Deployment complete!"
echo "🌐 Application URLs:"
echo "   API: http://$EC2_HOST:5000/api"
echo "   Web: http://$EC2_HOST:5000"