# Common troubles and possible solutions

## MongoDB on local machine does not start
I installed MongoDB on my local machine and the command `mongod` fails.

### Create the directory data
```bash
sudo mkdir -p /data/db
```
### Assign the ownership to mongodb (or your user)
```bash
# If mongodb user exists
sudo chown -R mongodb:mongodb /data/db

# Or your current user
sudo chown -R $USER:$USER /data/db
```
### Set the right permissions
```bash
sudo chmod -R 755 /data/db
```

### MongoDB service on local machine does not start
MongoDB is installed and the mongod server starts. Anyway I can't enable the mongod service

Create a custom service script as follow:

#### Crete the init script
```bash
sudo nano /etc/init.d/mongod
```

Script content:
```bash
#!/bin/bash
### BEGIN INIT INFO
# Provides:          mongod
# Required-Start:    $network $local_fs $remote_fs
# Required-Stop:     $network $local_fs $remote_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: MongoDB Database Server
# Description:       MongoDB Database Server
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/bin/mongod
CONFIG=/etc/mongod.conf
PIDFILE=/var/run/mongod.pid
LOGFILE=/var/log/mongodb/mongod.log
DBPATH=/data/db

case "$1" in
    start)
        echo "Starting MongoDB..."
        mkdir -p /var/log/mongodb
        mkdir -p $DBPATH
        $DAEMON --dbpath $DBPATH --logpath $LOGFILE --fork --pidfilepath $PIDFILE
        ;;
    stop)
        echo "Stopping MongoDB..."
        if [ -f $PIDFILE ]; then
            kill $(cat $PIDFILE)
            rm -f $PIDFILE
        else
            pkill mongod
        fi
        ;;
    restart)
        echo "Restarting MongoDB..."
        $0 stop
        sleep 2
        $0 start
        ;;
    status)
        if [ -f $PIDFILE ] && kill -0 $(cat $PIDFILE) 2>/dev/null; then
            echo "MongoDB is running (PID: $(cat $PIDFILE))"
        else
            echo "MongoDB is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
exit 0
```
### Make the script executable and register the service
```bash
sudo chmod +x /etc/init.d/mongod
sudo update-rc.d mongod defaults
```
#### Test the service
```bash
sudo service mongod start
sudo service mongod status
```