import os
from RestAPI import app    # Imports the code from RestAPI/__init__.py


if __name__ == '__main__':
    HOST = os.environ.get('SERVER_HOST', 'localhost')

    try:
        PORT = int(os.environ.get('SERVER_PORT', '3000'))
    except ValueError:
        PORT = 3000
    app.debug = True
    app.run(HOST, PORT)
