@echo off

echo "RunRedis.bat"
bash -c "sudo service redis-server start && echo 'Hit a key to stop the service' && read && sudo service redis-server stop"
echo "Hit a key to close"
pause
exit