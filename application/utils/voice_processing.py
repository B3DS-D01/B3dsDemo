from flask import current_app as app
import os
import speech_recognition as sr
#HOME=os.environ['BOT_HOME']+'/lib/bot/utils/'
HOME=app.config['LIB']

class GSUtility():
  def __init__(self):
    pass

  def convertToFlac(self,filename):
    r = sr.Recognizer()
    file = sr.AudioFile(filename)
    with file as source:
      r.adjust_for_ambient_noise(source, duration = 0.5)
      audio = r.record(source)

    print ("original sample rate = ")
    print (audio.sample_rate)
    flac_data = audio.get_flac_data(
        convert_rate=16000 if audio.sample_rate > 16000 else None,
        convert_width=2 )
    fName = filename.split('.wav')[0]
    open(fName+'.flac', 'wb').write(flac_data)

    self.uploadToGS('testbotlargefiles', fName+'.flac')
	
  def uploadToGS(self, bucket_name, source_file_name):
    from google.cloud import storage
    from google.oauth2 import service_account
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name) #Get the google cloud bucked. 
    listContents = bucket.list_blobs()	#Create  an list object of the audio files inside bucket
    destination_blob_name = source_file_name.split('upload/')[1]
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)
    print('File {} uploaded to {}.'.format(
          source_file_name,
          destination_blob_name))  

  def listAllAudioGs(self, bucket_name):
    from google.cloud import storage
    from google.oauth2 import service_account
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name) #Get the google cloud bucked. 
    listContents = bucket.list_blobs()	#Create  an list object of the audio files inside bucket
    listFiles = []
    for resource in listContents:
      gsUrl = 'gs://'+bucket_name+'/'+resource.name
      listFiles.append(gsUrl)
    return listFiles  

  def transcribe_gcs(self,url):
    from google.cloud import speech
    from google.cloud.speech import enums
    from google.cloud.speech import types
    from oauth2client.client import GoogleCredentials
    from google.oauth2 import service_account
    #api_credentials = GoogleCredentials.get_application_default()
    #credentials = service_account.Credentials.from_service_account_file('cred.json')
    #client = speech.SpeechClient(credentials=credentials)
    client = speech.SpeechClient()
    audio = types.RecognitionAudio(uri=url)
    config = types.RecognitionConfig(encoding=enums.RecognitionConfig.AudioEncoding.FLAC,
    sample_rate_hertz=16000,
    language_code='en-IN')

    operation = client.long_running_recognize(config=config, audio=audio)
    response = operation.result(timeout=180)
    finalelements = []
    final = {}
    transcript = ""
    for result in response.results:
      transcript += result.alternatives[0].transcript
    return transcript
  
  def combineAll(self,filename, text_folder):
    lists = self.listAllAudioGs('testbotlargefiles')
    url = 'gs://testbotlargefiles/'+filename+'.flac'
    faq_record = self.transcribe_gcs(url)
    print("This is transcribed text")
    print(faq_record)
    with open(text_folder+'/'+filename+'.txt', 'w') as fs:
      fs.write(faq_record)
    with open(HOME+'transcribed_faq.txt','a+') as f:
      f.write(repr(faq_record))

  #repr(transcript)
#  def combineAll(self):
#    lists = self.listAllAudioGs('testbotlargefiles')
#    faq_record = ""
#    for url in lists:
#      faq_record += self.transcribe_gcs(url)
#    with open(HOME+'transcribed_faq.txt','a+') as f:
#      f.write(repr(faq_record))

#gs = GSUtility()
#gs.combineAll()
#print (l)