import click
from app import db
from app.models import User

def register(app):
    @app.cli.group()
    def user():
        """User management commands."""
        pass

    @user.command()
    @click.argument("username")
    @click.option("-p", "--password")
    def create(username, password):
        """Create a new user."""
        exists = User.query.filter_by(username=username).scalar()
        if exists is None:
            u = User(username=username)
            u.set_password(password)
            db.session.add(u)
            db.session.commit()
            click.echo('User '+username+' created')
        else:
            click.echo('Error creating user: username '+username+' already exists')