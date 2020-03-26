import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config(object):
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'A93ac7iSe10e79Uw31LR4s82'
	SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
	SQLALCHEMY_TRACK_MODIFICATIONS = False # For event-based databases is TRUE
	XML_DIR = os.path.join(basedir, 'app', 'static', 'xml')
	#ICONS_DIR = os.path.join(basedir, 'app', 'static', 'img', 'icons')