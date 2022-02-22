# LIGFinder
 
Interactive and multi-criteria web-GIS application for finding parcels inside the city of Hamburg, Germany.

## Setup

Please make sure you have installed docker desktop in your system. 
To install the app, clone the project and navigate to the root directory. Then execute the following command:

```
 docker-compose up
```
### Database
To initially load the dabase dump into the dockerized databse run:
```
 docker exec db_ligfinder pg_restore -U postgres -d ligfinder /var/lib/postgresql/dumps/ligbackup.dump
```

To access to psql shell and manipulate the database tables:
```
 decker exec -ti db_ligfinder psql -U postgres -d ligfinder -v /var/lib/postgresql/dumps
```
