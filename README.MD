### Database
To initially load the dabase dump into the dockerized databse run:
```
 docker exec db_ligfinder pg_restore -U postgres -d ligfinder /var/lib/postgresql/dumps/ligbackup.dump
```