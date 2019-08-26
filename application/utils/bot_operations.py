from flask import current_app as app
import json
from loggers import *
logger = createLogger(__name__)

LIB=app.config['LIB']
#f = open('helo.json', 'w+')
#f.close()

users = None
userList = {}
with open(LIB+'listusers.json') as file:
  users = json.load(file)

for user in users:
  userList[user.get('id')] = user.get('name')

def scheckUserExist(userId):
  print (userList)
  if repr(userId) in userList :
    print ('user found')
    return True
  else :
    print ('user not found')
    return False

def writeToFile(str):
  with open(LIB+'listusers.json','w') as file:
    file.write(json.dumps(botUser))

def addNewuser(userId, userName):
  userList[userId] = userName

def addUserToDB(name, messenger, userId):
  import requests
  import socket
  
  user = {'name':name, 'messenger':messenger, 'userid':userId}
  payload = {'user':user}
  headers={'content-type':'application/json'}
  r = requests.post(url='https://0.0.0.0:8440/addNewuser',data=json.dumps(payload), headers=headers, verify=False)

def appointment(userText, userId, userName):
  appointmentj = {}
  timing = re.search('[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9] (PM|AM)', userText)
  a_type = re.search('Appointment:\s*([^\n\r ]*)', userText)
  purpose = re.search('Purpose:\s*([^\n\r]*)', userText)
  appointmentj['userId'] = userId
  appointmentj['userName'] = userName
  appointmentj['timing'] = timing.group()
  appointmentj['type'] = a_type.group(1)
  appointmentj['purpose'] = purpose.group(1)
  return appointmentj

def getAppointmentDetails(userId):
  with open(LIB+'userAppointment.json') as file:
    userAppoinment=json.load(file)
  if userId in userAppointment:
    return False
  else:
    return True

