#!/bin/sh 

# Upgrade database - the while loop ensures that the command keeps retrying until mysql container is up
while true; do
    flask db upgrade
    if [ "$?" = "0" ]; then
        break
    fi
    echo Database is still setting up, retrying in 5 secs...
    sleep 5
done

# Create admin user
flask user create admin -p admin0132
