"""App configuration."""
from os import environ
import os
import logging

class Config:

    """Set Flask configuration vars from .env file."""
    SECRET_KEY = 'r\xc4\xe2\xe1\xfd\x96)\x0eq;>\xd6\xc44s \x17\xf1\xb8=\xd7\xad{_'
#    FLASK_APP = environ.get('FLASK_APP')
    FLASK_ENV = 'development'
    LIB = os.environ['BOT_HOME']+"/lib/bot/application/utils/"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
