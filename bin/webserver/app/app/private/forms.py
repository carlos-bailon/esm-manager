from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length

class QuestionnaireForm(FlaskForm):
    name = StringField('Name*', validators=[DataRequired(message=' This field is required ')])
    short_name = StringField('Short name*', validators=[DataRequired(message=' This field is required ')])
    description = TextAreaField('Description')
    submit = SubmitField('Save')
    cancel = SubmitField('Cancel')