from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(message=' Username is required ')])
    password = PasswordField('Password', validators=[DataRequired(message=' Password is required ')])
    remember_me = BooleanField('Remember me')
    submit = SubmitField('Sign in')