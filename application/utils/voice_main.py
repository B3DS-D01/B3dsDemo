'''This program is a speech to text chatbot. It transcribes the file which contains all the questions and the answer 
into 3 clusters. And creates a file which contains all questions and their respective cluster number. If the question 
is in the list of the questions then it will give the answer from the respective cluster file which contains this questions 
and answer. If question is not in the list of questions, then the chatbot will find the answer based on keywords and 
prints the result and append the same question and answer in cluster file as well all questions file so that it can be 
recorded later for further reference'''

from flask import current_app as app
import nltk
import json
import warnings
warnings.filterwarnings("ignore")
#nltk.download() # for downloading packages

import speech_recognition as sr
from gtts import gTTS

import re
import numpy as np
import random
import string # to process standard python strings

import math
import os
from random import sample
import _pickle as cPickle  #The pickle module already imports _pickle if available. It is the C-optimized version of the pickle module, and is used transparently.
from tqdm import *         #for progress bar

from scipy.spatial.distance import cdist  #Compute distance between each pair of the two collections of inputs.
from texttable import Texttable   #Python module for creating simple ASCII tables
import indicoio             #A Python Wrapper for indico. Use pre-built state of the art machine learning algorithms with a single line of code.

indicoio.config.api_key = "b1b35f65d921fd2d6d0f1933e3f9e99a"

from textblob import TextBlob    #TextBlob is a python library and offers a simple API to access its methods and perform basic NLP tasks. 

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import numpy
#from voice_processing import *
from application.utils import brain as bm
from application.utils.brain import *
#HOME=os.environ['BOT_HOME']+'/lib/bot/utils/'
HOME=app.config['LIB']
def train():
  import importlib
  importlib.reload(bm)
  
def main(file_input):         
        user_input = {"API_INPUT":"MESSENGER","MESSAGE":file_input}
                #{"API_INPUT":"MESSENGER","MESSAGE":"When was football played in India?"}
                # provide the input in the json format if giving input in the text form instead of voice
        user_input = json.dumps(user_input)
        d = json.loads(user_input)
        user_response=d["MESSAGE"]             #user_response is the question asked by A user, like - what is chatbot?
        print(user_response)

        if user_response in raw_2:             #if question is already present in the list of questions i.e in predicted_data.txt
            for i in range(len(sent_tokens_2)):
                if user_response in sent_tokens_2[i]:
                    answer = pattern3.search(sent_tokens_2[i])
                    answer2 = pattern.search(answer.group())
                    answer3 = pattern2.search(answer2.group())

                    answer5 = pattern5.search(sent_tokens_2[i])
                    answer5 = answer5.group()
                    if answer5 == '0':      #if answer is present in cluster 0, this section search the answer in cluster_0.txt only.
                        f = open(HOME+'cluster_0.txt','r')
                        line = f.read()
                        line=line.lower()

                        sentence_tokens= nltk.sent_tokenize(line)

                        for i in range(len(sentence_tokens)):
                            if user_response in sentence_tokens[i]:
                                answer2 = pattern.search(sentence_tokens[i])
                                answer3 = pattern2.search(answer2.group())
#                                print('cluster 0:',answer3.group())                
                                return answer3.group()                
                    elif answer5 == '1':    #if answer is present in cluster 1, this section search the answer in cluster_1.txt only.
                        f = open(HOME+'cluster_1.txt','r')
                        line = f.read()
                        line=line.lower()

                        sentence_tokens = nltk.sent_tokenize(line)

                        for i in range(len(sentence_tokens)):
                            if user_response in sentence_tokens[i]:
                                answer2 = pattern.search(sentence_tokens[i])
                                answer3 = pattern2.search(answer2.group())
#                                print('cluster 1:',answer3.group())                
                                return answer3.group()                
                    else:                    #if answer is present in cluster 2, this section search the answer in cluster_2.txt only.
                        f = open(HOME+'cluster_2.txt','r')
                        line = f.read()
                        line=line.lower()

                        sentence_tokens = nltk.sent_tokenize(line)

                        for i in range(len(sentence_tokens)):
                            if user_response in sentence_tokens[i]:
                                answer2 = pattern.search(sentence_tokens[i])
                                answer3 = pattern2.search(answer2.group())
#                                print('cluster 2:',answer3.group())
                                return answer3.group()                
        
        else:      # if question is not present in predicted_data.txt then chatbot will search the answer on the basis of keywords of the question asked.
            return prediction(user_response, d)

#while (True):
#  print(main(input('You (Enter the question in text or voice format(.wav):\t')))
