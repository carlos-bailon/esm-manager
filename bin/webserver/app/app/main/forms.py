from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired(message=' Este campo es obligatorio ')])
    password = PasswordField('Contraseña', validators=[DataRequired(message=' Este campo es obligatorio ')])
    remember_me = BooleanField('Recordarme')
    submit = SubmitField('Iniciar sesión')