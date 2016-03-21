This project is for the back end server for the snowranger project

This project was created using visual studio but it should run on any os with the proper node.js instalation.

All of the dependencies are located in the package.json file.

----- MODULES -----
Each module will be contained in a folder under root.

List of current modules:
auth- This module will handle all of teh autorization from server to 3rd party services and server to client

data- This module will handle managing the data in the database. It will go out and sync to other dbs as well as recieve data from clients and push it to the db

database- This module handles all calls to and from the db. Right now it is using firebase as the db

rest- This modules is the rest server. It will pass all calls recieved to other modules for processing

util- This modules has utility funtions