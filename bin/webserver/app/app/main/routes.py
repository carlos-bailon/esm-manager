from flask import render_template, flash, current_app, send_from_directory, redirect, url_for, request
from flask_login import current_user, login_user, logout_user
from werkzeug.urls import url_parse
from app.models import User
from app.main import bp
from app.main.forms import LoginForm

@bp.route('/', methods=['GET', 'POST'])
@bp.route('/index', methods=['GET', 'POST'])
def index():
    # If user is already authenticated, redirect to user dashboard
    if current_user.is_authenticated:
        return redirect(url_for('private.user', username=current_user.username))
    # if not, prepare the login form
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('main.index'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('private.user', username=current_user.username)
        return redirect(next_page)
    return render_template('index.html', form=form)

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@bp.route('/xml/<id>')
def xml(id):
    return send_from_directory(current_app.config['XML_DIR'], 'questionnaire_'+id+'.xml')