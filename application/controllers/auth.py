"""Routes for user authentication."""
from flask import redirect, render_template, flash, Blueprint, request, url_for
from flask_login import login_required, logout_user, current_user, login_user
from flask import current_app as app
from werkzeug.security import generate_password_hash
from ..assets import compile_auth_assets
from ..forms import LoginForm
from ..models.loginusers import db, LoginUsers
from ..import login_manager
import traceback
# Blueprint Configuration
auth_bp = Blueprint('auth_bp', __name__,
                    template_folder='templates',
                    static_folder='static')
compile_auth_assets(app)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login_page():
    """User login page."""
    try:
      # Bypass Login screen if user is logged in
      if current_user.is_authenticated:
          print (	url_for('main_bp.dashboard') )
          return redirect(url_for('main_bp.dashboard'))
      login_form = LoginForm(request.form)
      # POST: Create user and redirect them to the app
      if request.method == 'POST':
          if login_form.validate():
              # Get Form Fields
              email = request.form.get('email')
              password = request.form.get('password')
              # Validate Login Attempt
              user = LoginUsers.query.filter_by(email=email).first()
              if user:
                  if user.check_password(password=password):
                      print ("Password is valid")
                      print (  url_for('main_bp.dashboard')  )
                      login_user(user)
                      print (user.get_id())
                      next = request.args.get('next')
                      return redirect(next or url_for('main_bp.dashboard'))
          flash('Invalid username/password combination')
          return redirect(url_for('auth_bp.login_page'))
      # GET: Serve Log-in page
      return render_template('login.html',
                           form=LoginForm(),
                           title='Log in | Flask-Login Tutorial.',
                           template='login-page',
                           body="Log in with your User account.")
    except Exception:
      traceback.print_exc()

@auth_bp.route("/logout")
@login_required
def logout_page():
    """User log-out logic."""
    logout_user()
    return redirect(url_for('auth_bp.login_page'))


@login_manager.user_loader
def load_user(user_id):
    """Check if user is logged-in on every page load."""
    if user_id is not None:
        return LoginUsers.query.get(user_id)
    return None


@login_manager.unauthorized_handler
def unauthorized():
    """Redirect unauthorized users to Login page."""
    flash('You must be logged in to view that page.')
    return redirect(url_for('auth_bp.login_page'))
