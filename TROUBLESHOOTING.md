# Common troubles and possible solutions

## MongoDB on local machine
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