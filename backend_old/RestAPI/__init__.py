from flask import Flask
app = Flask(__name__)
from flask_cors import CORS

CORS(app, resources={r'/*': {'origins': '*'}})
import RestAPI.views