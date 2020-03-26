from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db, login

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    last_connection = db.Column(db.DateTime, default=datetime.utcnow)
    questionnaires = db.relationship('Questionnaire', backref='creator', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login.user_loader
def login_user(id):
    return User.query.get(int(id))

class Questionnaire(db.Model):
    __tablename__ = "questionnaires"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    description = db.Column(db.Text)
    version = db.Column(db.String(32))
    path = db.Column(db.String(256))
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_date = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    last_update = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    def __repr__(self):
        return '<Questionnaire {}>'.format(self.name)