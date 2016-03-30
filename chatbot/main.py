from client import *
from Bot import *
from IrcEndpoint import *

import FirebaseAPI
import Boston311
from datetime import datetime, timedelta

bot = None

def main():
    CreateBot()
    #ConnectToIRC()
    #FB_Test()
    #ConnectToFacebook()
    B311Test()

    while 1:
        pass

def CreateBot():
    global bot
    bot = Bot("notificationbot", True)

def FB_Test():
    FirebaseAPI.Run()

def B311Test():
    three = Boston311.Boston311Endpoint()

def ConnectToIRC():
    global bot

    irc = IrcEndpoint(bot)

    bot.AddEndpoint(irc)

    pass

def ConnectToFacebook():
    
    cl = Client("alexswdevtest@gmail.com", 100011287874549, "facebookpassword", bot)
    
    bot.AddEndpoint(cl)
    
    
main()
