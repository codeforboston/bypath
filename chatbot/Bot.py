#!/usr/bin/env python
import threading
import requests
import FirebaseAPI

imageFolder = "images/"

class Bot:
    name = None
    downloadImages = False
    endpoints = []
    trds = []
    
    def __init__(self, name, downloadImages = False):
        self.name = name
        self.downloadImages = downloadImages
        self.firebase = FirebaseAPI.getFBApplication()
        
    def AddEndpoint(self, endpoint):
        self.endpoints.append(endpoint)
        
        endpoint.Connect()
        endpoint.listen()
        # I'm threading so I can have more than one endpoint listening at a time
        # the data should be coming async
        #t = threading.Thread(target=endpoint.listen)
        # classifying as a daemon, so they will die when the main dies
        #t.daemon = True
    
        # begins, must come after daemon definition
        #t.start()
        #self.trds.append(t)
        
    # Endpoint is where the data is coming from, It's most likley coming form facebook
    # User is a list, the first element should be the user's name, after that is data for the endpoint for replying to the user
    # Message is just what the user wrote, I need to be able to parse it out
    # Image is a list. The first element should be the image's name, the second element should be it's url
    def RecieveMessage(self, endpoint, user, message, image = None):
        print("Bot recieved message: '%s' from user: %s"%(message, user[0]))

        img = ''
        # Need to do some checks to make sure we have valid image
        if image != None:
            img = image[0]
            print("Image %s has been submitted"%(image[0]))
            print("Url: %s"%(image[1]))
            
            if self.downloadImages:
                f = open(imageFolder + image[0] + '.jpg','wb')
                f.write(requests.get(image[1]).content)
                f.close()

        self.addToFirebase('/Notifications' + endpoint.path, {'user': user[0], 'message': message, 'image': img})

            
        output = '%s message %s has been received' %(user[0], message)
        endpoint.send(user[0], output)
        '''
        user = message[0]
        server = message[1]
        mType = message[2]
        channel = message[3]
        cmd = message[4]
        msg = message[5]
        
        if cmd.find("Alert") != -1:
            print("Alert recieved: " + msg)
            endpoint.SendMessage("User {}, we recieved your alert for {}".format(user, msg))
        '''

    #put single in firebase
    def addToFirebase(self, path, data):
        self.firebase.post(path, data)

    #put list in firebase
    def multAddToFirebase(self, path, datas):
        for data in datas:
            self.addToFirebase(path, data)