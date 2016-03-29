import os.path
import json
from firebase import firebase

fb_url = 'https://alexdev.firebaseio.com/'

def getFBApplication():
    return firebase.FirebaseApplication(fb_url, None)

def __getData(entry):
    lat = entry['latitude']
    lon = entry['longitude']
    geo = entry['geocoded_location']
    type = entry['type']

    return {'latitude': lat, 'longitude': lon, 'geo-coords': geo, 'type': type}

class FB:
    last_checked_key = 'last_checked'


    def __init__(self):
        self.firebaseApplication = getFBApplication()

    def post(self, path, data):
        self.firebaseApplication.post(path, data)

    def getLastChecked(self, path):
        return self.firebaseApplication.get(path + '/' + self.last_checked_key, None) or 0

    def setLastChecked(self, path, last_checked):
        self.firebaseApplication.patch(path, {self.last_checked_key: last_checked})

def Run():
    fb = FB()
    last = fb.getLastChecked('/Notifications/311')
    print(last)

    last += 10

    fb.setLastChecked('/Notifications/311', last)

    return
    bp = os.path.dirname(__file__)
    fp = os.path.abspath(os.path.join(bp, "..", "..", "311-data-example.json"))
    f = open(fp, "r")
    data = f.read()
    d = json.loads(data, strict=False)
    for entry in d:
        if entry['case_status'] != 'Open':
            if 'case_title' in entry:
                type = entry['case_title']
                if type == "Request for Snow Plowing" or type == 'Unsafe/Dangerous Conditions' or  type == 'Park Maintenance' or  type == 'Ground Maintenance':

                    fb.post('/Notifications/311', __getData(entry))

