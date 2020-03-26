from flask import request
from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField, TextAreaField, SubmitField, FieldList, FormField, Form, IntegerField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Questionnaire

class QuestionnaireForm(FlaskForm):
    name = StringField('Name*', validators=[DataRequired(message=' This field is required ')])
    short_name = StringField('Short name*', validators=[DataRequired(message=' This field is required ')])
    description = TextAreaField('Description', validators=[Length(min=0)])
    submit = SubmitField('Save')
    cancel = SubmitField('Cancel')