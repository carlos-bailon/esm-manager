import os
import click
from flask.cli import AppGroup
from app import db
from app.models import User

def register(app):

    user_cli = AppGroup('user')

    @user_cli.command("create")
    @click.argument("username")
    @click.option("-p", "--password")
    def create_user(username, password):
        exists = User.query.filter_by(username=username).scalar()
        if exists is None:
            u = User(username=username)
            u.set_password(password)
            db.session.add(u)
            db.session.commit()
            click.echo('User '+username+' created')
        else:
            click.echo('Error creating user: username '+username+' already exists')

    app.cli.add_command(user_cli)

