Snowranger is working to help low-mobility individuals plan trips in cities, by collecting and presenting information about barriers to passage, such as construction and unplowed snow.  We plan to collect this data from the users themselves using a mobile app. Our ultimate goal is to make this a transportation option for Google transit directions for the end-users, and an enforcement tool and a data source for municipalities.  


## Fire'r up! 
```bash
$ workon myVirtualEnv # Virtualenv with python 3.5.0
$ sudo pip3 install Django # If you don't have Django, get it. 
$ cd path/to/snowranger
$ python3 ./src/snowranger/manage.py runserver # http://127.0.0.1:8000/
```

### Find the front end
```bash
# The main index.html
/snowranger/src/snowranger/conditions/static/templates/conditions/snowranger.html
# Javascript components
/snowranger/src/snowranger/conditions/static/conditions/(js|css)
# There is also...
/snowranger/src/snowranger/static/img # This is where the images live for now. But this will change. 
```

----
### Ignore the darn __pycachers__. 
> http://stackoverflow.com/questions/1470572/gitignore-ignore-any-bin-directory

```
# .gitignore
__pycache__/
```
```
# So if you want add to ignore some directories in your local repository (which already exist) after editing .gitignore you want to run this on your root dir
$ git rm --cached -r .
$ git add .
```

## Install Python dependencies
```
$ pip install -r requirements.txt # or pip3, whatever you're rockin
```
