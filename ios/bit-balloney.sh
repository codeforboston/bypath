#!/bin/bash

rsync -avz -L --progress app/ ~/Desktop/$1 # not www/
rsync -avz -L --progress .tmp/main/styles/main.css ~/Desktop/$1/main/styles/
rm -r ~/Desktop/$1/main/styles/*.scss

