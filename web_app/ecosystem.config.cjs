module.exports = {
  apps: [{
    name: 'web_app',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGODB_URI: 'mongodb+srv://dosuoha:63SngoHHhZxYklc0@cluster0.1ziqjik.mongodb.net/social_app?retryWrites=true&w=majority&appName=Cluster0',
      JWT_SECRET: 'yUAAhybM6URKP2ppYYLC0dEBlfqtELFnu5UUyeG6H0Bk='
    }
  }]
};