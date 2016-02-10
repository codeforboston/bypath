#!/usr/bin/env python
import threading


class Bot:
    name = None
    endpoints = []
    trds = []
    
    def __init__(self, name):
        self.name = name
        
    def AddEndpoint(self, endpoint):
        self.endpoints.append(endpoint)
        endpoint.ConnectToChannel()
        endpoint.SetDisplayName(self.name, self.name)
        endpoint.JoinChannel()
        
        t = threading.Thread(target=endpoint.CheckForMessages, args=[self])
        # classifying as a daemon, so they will die when the main dies
        t.daemon = True
    
        # begins, must come after daemon definition
        t.start()
        
    #0 - user
    #1 - server
    #2 - message type
    #3 - channel
    #4 - command
    #5 - message
    def RecieveMessage(self, endpoint, message):
        
        user = message[0]
        server = message[1]
        mType = message[2]
        channel = message[3]
        cmd = message[4]
        msg = message[5]
        
        if cmd.find("Alert") != -1:
            print("Alert recieved: " + msg)
            endpoint.SendMessage("User {}, we recieved your alert for {}".format(user, msg))