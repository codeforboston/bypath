from client import *
from Bot import *

def main():
    bot = Bot("fbbot")
    
    cl = Client("alexswdevtest@gmail.com", 100011287874549, "facebookpassword", bot)
    
    bot.AddEndpoint(cl)
    
    while 1:
        pass
    
    
main()
