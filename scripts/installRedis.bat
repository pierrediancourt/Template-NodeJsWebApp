@echo off

echo "InstallRedis.bat"
bash -c "sudo apt-get install redis-server && echo 'Hit a key to close' && read"
