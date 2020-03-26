#!/bin/bash

# Copy private folder to context
cp -r private bin/webserver/data
cp -r private bin/phpmyadmin/data

# Copy Nginx conf file
cp private/nginx.conf bin/webserver/app

# Build images and deploy containers
docker-compose up -d
