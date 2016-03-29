import requests
import FirebaseAPI
from datetime import datetime, timedelta

class Boston311Endpoint:
    caseTypes = {'Ground Maintenance', 'Unsafe/Dangerous Conditions', 'Park Maintenance', 'Request for Snow Plowing'}

    def __init__(self):
        fb = FirebaseAPI.FB()

        lastChekedItemId = fb.getLastChecked('/Notifications/311') or (datetime.now() - timedelta(days = 30)).isoformat('T')
        currentCheckedItemId = lastChekedItemId

        itemsAdded = 0;

        for type in self.caseTypes:

            r = requests.get(
                "https://data.cityofboston.gov/resource/wc8w-nujj.json?$query=" + self.generateSelectStatement(lastChekedItemId, type),#SELECT * WHERE CASE_ENQUIRY_ID > " + str(lastChekedItemId) + " and CASE_STATUS = 'Open'",
                             headers={"X-App-Token":"k7chiGNz0GPFKd4dS03IEfKuE"})

            itemsAdded = len(r.json())

            #print(r.json())
            for item in r.json():
                result = self.BuildData(item)

                if (result != 0):
                    fb.post('/Notifications/311', result)
                else:
                    itemsAdded -= 1


                #print(item['case_enquiry_id'])

        fb.setLastChecked('/Notifications/311', datetime.now().isoformat('T'))

        print(str(itemsAdded) + " items have been added")

    def BuildData(self, entry):
        try:
            id = entry['case_enquiry_id']
            title = entry['case_title']
            loc = entry['location']
            lat = entry['latitude']
            lon = entry['longitude']
            geo = entry['geocoded_location']
            type = entry['type']

            return {'location': loc, 'case_enquiry_id': id,'case_title': title, 'latitude': lat, 'longitude': lon, 'geo-coords': geo, 'type': type}
        except:
            return 0


    def generateSelectStatement(self, date, caseType):
        statement = "SELECT * WHERE open_dt > '" + str(date) + "' and CASE_STATUS = 'Open' AND STARTS_WITH(case_title, '" + caseType + "')"

        '''
        cases = ""
        for type in self.caseTypes:
            if cases != "":
                cases += " OR "

            cases +="STARTS_WITH(case_title, ('" + type + "')"
        statement += cases
        '''
        print(statement)
        return statement

    def Connect(self):
        pass

    def listen(self):
        pass
        #longitude
        #latitude
        #geocoded_location