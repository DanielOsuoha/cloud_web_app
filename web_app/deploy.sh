#!/bin/bash

# Set variables with proper quoting
EC2_HOST="34.205.144.114"
APP_DIR="/var/www/web_app"
KEY_PATH="$HOME/.ssh/cloud_web_app.pem"

# First, verify SSH key exists
if [ ! -f "$KEY_PATH" ]; then
    echo "❌ SSH key not found at $KEY_PATH"
    exit 1
fi

# Build and deploy
echo "🏗️  Building application..."
npm run build

echo "📦 Deploying to EC2..."
scp -i "$KEY_PATH" -r \
    ./* \
    "ubuntu@${EC2_HOST}:${APP_DIR}/"

echo "🚀 Starting application..."
ssh -i "$KEY_PATH" "ubuntu@${EC2_HOST}" << 'EOF'
    cd /var/www/web_app
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Update package.json scripts
    sed -i 's/"dev": "vite"/"dev": "vite --host 0.0.0.0"/' package.json
    
    # Install Vite globally
    sudo npm install -g vite
    
    # Start application with PM2
    pm2 delete all || true
    pm2 start ecosystem.config.cjs --name "api" -- server.js
    pm2 start "npm run dev" --name "vite"
    pm2 save
    
    # Verify deployment
    echo "\n🔍 Checking deployment..."
    sleep 5
    
    # Test API
    if ! curl -s http://localhost:5000/api/posts; then
        echo "\n❌ API failed - Showing logs:"
        pm2 logs --lines 20
        exit 1
    fi
    
    # Show status
    echo "\n📊 PM2 Status:"
    pm2 list
EOF

echo "✅ Deployment complete!"
echo "🌐 Application URLs:"
echo "   API: http://${EC2_HOST}:5000/api"
echo "   Frontend: http://${EC2_HOST}:5173"
echo "   Web: http://${EC2_HOST}:5000"