#!/usr/bin/env python
import socket 

class IrcEndpoint:
    bot    = None
    bufsize    = 2048
    channel    = None
    port       = None
    server     = None
    master     = "botowner"
    uname      = "ircusername"
    realname   = "realname"
    
    ircsock = None
    
    def __init__(self, channel):
        self.server = "irc.freenode.net"
        self.port = 6667
        self.channel = channel
        
    def ConnectToChannel(self):
        self.ircsock = socket.socket (socket.AF_INET, socket.SOCK_STREAM)
        self.ircsock.connect ((self.server, self.port))
        
        
    def SetDisplayName(self, user, nick):
        self.ircsock.send(bytes("USER " + user + " 2 3 " + self.realname + "\n",'UTF-8'))
        self.ircsock.send(bytes("NICK "+ nick + "\n", 'UTF-8'))
    
    def JoinChannel(self):
        self.ircsock.send(bytes("JOIN "+ self.channel +"\n", 'UTF-8'))
        print("endpoint joined channel")
        
    def CheckForMessages(self, bot):
        #This will check continuesly so it should be run on another thread
        while 1:
            output = [None] * 6
            ircmsg = self.ircsock.recv(self.bufsize).decode('UTF-8')
                                
            ircmsg = ircmsg.strip('\n\r')# Remove newlines
            print(ircmsg) # Print the message for fun
            
            #need to parse out the irc info into usable stuff for the bot
            #we need to grab 
            #0 - user
            #1 - server
            #2 - message type
            #3 - channel
            #4 - command
            #5 - message
            m2 = ircmsg
            
            #grab the user name
            usrIdx = m2.find('!')
            
            #This is a primitive way to check if the messages was sent by a user
            #instead of just a server command
            if usrIdx >= 0:
                user = m2[1:usrIdx] #first char is a ':' and we want to skip it
                m2 = m2[usrIdx + 1:]
                
                #grab the server name
                serIdx = m2.find(' ')
                server = m2[:serIdx]
                m2 = m2[serIdx + 1:]
                
                #grab the message type
                typeIdx = m2.find(' ')
                mType = m2[:typeIdx]
                m2 = m2[typeIdx + 1:]
                
                #grab the channel 
                chanIdx = m2.find(' ')
                channel = m2[:chanIdx]
                m2 = m2[chanIdx + 1:]
                
                #finally get the message
                #the first char is a ':' and we want to skip it
                msg = m2[1:].strip()
                cmd = None
                
                # if we have a command pull it out of the message
                if msg[0] == '!':
                    cmdIdx = msg.find(' ')
                    cmd = msg[1:cmdIdx]
                    msg = msg[cmdIdx + 1 :].strip()
                    
                    
                #assign the values for the output
                output[0] = user
                output[1] = server
                output[2] = mType
                output[3] = channel
                output[4] = cmd
                output[5] = msg
                
                #If we have a command then pass it to the bot for processing
                if cmd != None:
                    bot.RecieveMessage(self, output)
                        
            else:
                #If the servers pings us we need to respond in kind
                #or else we will get kicked for inactivity
                if ircmsg.find ("PING :") != -1:
                    self.ping()
                
            
                
    def SendMessage(self, message):
        self.ircsock.send(bytes("PRIVMSG "+ self.channel +" :"+ message + "\n", 'UTF-8'))
        
    def ping(self):
        print("PONG")
        self.ircsock.send(bytes("PONG :pingis\n", 'UTF-8'))
                                # Exit with success status