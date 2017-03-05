@echo off

set NODE_ENV=development
set PORT=3000 
set REDIS_URI=redis://localhost
set REDIS_SECRET=secret
set MONGODB_URI=mongodb://localhost
echo "You can close this by hitting CTRL+C when you're done using the project
echo "The project will be restarted automatically when you modify and save a file"
echo "However you might need to hit enter in some situations to trigger the restart"
npm start
