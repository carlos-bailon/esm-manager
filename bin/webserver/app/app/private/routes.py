import os
from datetime import datetime
from flask import render_template, request, redirect, flash, url_for
from flask_login import current_user, login_required
from app import db
from app.models import User, Questionnaire
from app.private import bp
from app.private.forms import QuestionnaireForm
from app.private.handlers import generate_xml

@bp.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_connection = datetime.utcnow()
        db.session.commit()

@bp.route('/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    questionnaires = user.questionnaires.order_by(Questionnaire.created_date.asc()).all()
    return render_template('private/user.html', user=user, questionnaires=questionnaires)

@bp.route('/user/<username>/editor', methods=['GET', 'POST'])
@login_required
def questionnaire_editor(username):
    user = User.query.filter_by(username=username).first()
    questionnaire_id = request.args.get('questionnaire_id')
    form = QuestionnaireForm()
    # If test_id is None, it is a ***NEW TEST***
    if questionnaire_id == None:
        # Test validated and submitted
        if form.validate_on_submit():
            if form.submit.data:
                # Insert questionnaire in the database
                questionnaire = Questionnaire(name=form.name.data, description=form.description.data, creator_id=user.id, created_date=datetime.utcnow(), last_update=datetime.utcnow())
                db.session.add(questionnaire)
                db.session.commit()
                filepath = generate_xml(Questionnaire.query.order_by(Questionnaire.id.desc()).first().id) # Generate the XML file from the request POST form and pass questionnaire id
                Questionnaire.query.order_by(Questionnaire.id.desc()).first().path = filepath
                db.session.commit() # Update the filepath
                flash('Test created successfully')
                return redirect(url_for('private.user', username=username))
        # Cancel button clicked
        if form.cancel.data:
            return redirect(url_for('private.user', username=username))
        return render_template('private/editor.html', form=form)
    # If there is a value for test_id, it is a ***TEST EDITION***
    else:
        questionnaire = Questionnaire.query.get(questionnaire_id)
        # Edition validated and submitted
        if form.validate_on_submit():
            if form.submit.data:
                # Update questionnaire register in the database
                questionnaire.name = form.name.data
                questionnaire.description = form.description.data
                questionnaire.last_update = datetime.utcnow()
                db.session.commit()
                filepath = generate_xml(questionnaire_id) # Generate again the XML file from the request POST form
                flash('Test edited successfully')
                return redirect(url_for('private.user', username=username))
        # Cancel button clicked
        if form.cancel.data: 
            return redirect(url_for('private.user', username=username))
        # Delete button clicked
        if request.form.get('removeQuestionnaireButton') == 'Delete':
            # Remove test register from database
            os.remove(questionnaire.path)
            db.session.delete(questionnaire)
            db.session.commit()
            flash('Test deleted successfully')
            return redirect(url_for('private.user', username=username))
            
        return render_template('private/editor.html', form=form, questionnaire=questionnaire, url=url_for('main.xml', id=questionnaire_id))