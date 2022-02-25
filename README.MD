# LIGFinder
 
Interactive and multi-criteria web-GIS application for finding parcels inside the city of Hamburg, Germany.

## Setup

### For users

Please make sure you have installed docker desktop in your system. 
To install the app, clone the project and navigate to the root directory. Then execute the following command:

```
 docker-compose up
```

This command builds a container with  frontend, backend and database images.


To initially load the dabase dump into the dockerized databse run:
```
 docker exec db_ligfinder pg_restore -U postgres -d ligfinder /var/lib/postgresql/dumps/ligbackup.dump
```

The database dump can be provided over request.

### For Developers

After cloning the project, navigate to the root directory.
To install the required packages and start the frontend, navigate to the "frontend" directory and run the following commands:

``
 	npm install
``
and then, 
``
 	npm run serve
``

Then frontend app is runned and can be accessed at the following address:


 http://localhost:8080/


Navigate to the "backend" directory and install the packages inside the requirements.txt file:

``
pip install -r requirements.txt
``

To run the backend, execute the following command:

``
 python runserver.py
``

Then, the backend Flak application will be run at the following address:

http://localhost:3000/

In the next step, you can create a local database named "ligfinder" with postgis extension. As mentioned above, to populate database, the database dump can be provided over request.

You can specify your database configuration by modifying the following line:

``
backend/RestAPI/db.py#L5
``
