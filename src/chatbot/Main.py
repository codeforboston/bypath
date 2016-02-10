#!/usr/bin/env python

from Bot import Bot
from IrcEndpoint import IrcEndpoint

def Main():
    bot = Bot("NotificationBot")
    
    endpoint = IrcEndpoint("#mytestchannel0122")
    
    bot.AddEndpoint(endpoint)
    
    while True:
        pass


#---------------------------------------------------------------------
# Main program.

Main()
exit (0)    