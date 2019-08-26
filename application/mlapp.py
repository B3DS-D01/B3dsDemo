from flask import Flask, render_template, request, Blueprint, Response
from flask import current_app as app
from flask import jsonify
from flask_login import login_required
import json
import sys
import os, re
import logging
from logging import Formatter, FileHandler
import os
from werkzeug import secure_filename
import traceback
from loggers import *
from flask_cors import CORS, cross_origin

CORS(app, origins="*")
logger = createLogger(__name__)
main_app = Blueprint('main_app', __name__,
                    template_folder='templates',
                    static_folder='static')

handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
handler.setFormatter(Formatter(
        '%(asctime)s %(levelname)s: %(message)s '
        '[in %(pathname)s:%(lineno)d]'
     ))
