# LIGFinder
 
Interactive and multi-criteria web-GIS application for finding parcels inside the city of Hamburg, Germany.

## Setup

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
