from werkzeug.middleware.dispatcher import DispatcherMiddleware
from app import app as app_app
from auth import app as auth_app

application = DispatcherMiddleware(app_app, {
    '/auth': auth_app
})

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('0.0.0.0', 5000, application)