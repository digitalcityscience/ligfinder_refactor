import psycopg2
from psycopg2.extras import Json
from os import getenv

dbConfig = {
    'host': getenv('DB_HOST', 'database'),
    'port': getenv('DB_PORT', 5432),
    'dbname': getenv('DB_NAME', 'ligfinder'),
    'user': getenv('DB_USER', 'postgres'),
    'password': getenv('DB_PASSWORD', 'postgres')
}

def connect():
  return psycopg2.connect(
    host=dbConfig['host'],
    port=dbConfig['port'], 
    dbname=dbConfig['dbname'], 
    user=dbConfig['user'], 
    password=dbConfig['password'])

def get_buildings(gid):
  conn = connect()
  cur = conn.cursor()
  cur.execute("SELECT * FROM building where gid=%s", (gid,))
  building = cur.fetchall()
  cur.close()
  conn.close()
  return building

def get_users(username, password):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""SELECT * FROM users where username=%s AND password=%s""", (username, password,) )
  user = cur.fetchall()
  cur.close()
  conn.close()
  return user

def get_table_names():
  conn = connect()
  cur = conn.cursor()
  cur.execute("""select table_name from information_schema.columns where column_name = 'geom'
    AND table_name NOT in ('bike_network', 'counties_daily', 'drive_network', 'parcel', 'building', 'walk_network', 'geocoded_address', 'counties', 'pop', 'elbvertiefung',	'bezirke', 'gemarkungen', 'stadtteile', 'statistischegebiete')  """)
  user = cur.fetchall()
  cur.close()
  conn.close()
  return user

def get_table(tableName):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""select json_build_object(
'name', '%s', 'oid', (SELECT '%s'::regclass::oid), 'left', (select min(ST_XMin(geom)) from %s), 'bottom', (select min(ST_YMin(geom)) from %s), 'right', (select max(ST_XMax(geom)) from %s), 'top', (select max(ST_YMax(geom)) from %s),
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(t.*)::json)
    )
from %s
      as t;""" %(tableName, tableName, tableName, tableName, tableName, tableName, tableName))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def get_feature(tableName, featureid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""select json_build_object(
    'tablename', '%s',
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(t.*)::json)
    )
from %s as t where gid = %s
      ;""" %(tableName,tableName, featureid))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def get_union_features(tableName, featureid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""select st_asgeojson(st_union(geom)) from %s where gid in %s
      ;""" %(tableName, featureid))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def get_selected_featuress(tableName, featureid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from (select * from %s where gid in %s ) as foo, parcel  where ST_Intersects(parcel.geom, foo.geom)
      ;""" %(tableName, featureid))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def get_selected_feature(tableName, featureid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from (select * from %s where gid = %s ) as foo, parcel  where ST_Intersects(parcel.geom, foo.geom)
      ;""" %(tableName, featureid))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user


def get_geom_aoi(geom):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where ST_Intersects(parcel.geom, ST_GeomFromGeoJSON('%s'))
      ;""" %(geom))
  user = cur.fetchall()[0][0]

  cur.close()
  conn.close()
  return user

def get_iso_aoi(mode, lng, lat, time):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(iso.*)::json)
    )
  from (SELECT ST_ConcaveHull(ST_Collect(the_geom), 0.9) from pgr_drivingDistance(
        'SELECT gid AS id, source, target, cost_time AS cost FROM %s',
       (SELECT id
  FROM %s_vertices_pgr 
  ORDER BY st_setSRID(ST_MakePoint( %s, %s), 4326) <-> %s_vertices_pgr.the_geom
  LIMIT 1),%s, false
) AS pt JOIN %s_vertices_pgr rd ON pt.node = rd.id ) as iso

      ;""" %(mode, mode, lng, lat, mode, time, mode))
  user = cur.fetchall()[0][0]

  cur.close()
  conn.close()
  return user

def spatial_union(geom1, geom2):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(merged.*)::json)
    )

  from (select ST_Union(ST_GeomFromGeoJSON('%s'), ST_GeomFromGeoJSON('%s'))) AS merged
      ;""" %(geom1, geom2))
  user = cur.fetchall()[0][0]

  cur.close()
  conn.close()
  return user

def spatial_intersection(geom1, geom2):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(intersected.*)::json)
    )

  from (select ST_Intersection(ST_GeomFromGeoJSON('%s'), ST_GeomFromGeoJSON('%s'))) AS intersected
      ;""" %(geom1, geom2))
  user = cur.fetchall()[0][0]

  cur.close()
  conn.close()
  return user


def get_iso_parcel(mode, lng, lat, time):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where ST_Intersects(parcel.geom, (SELECT ST_ConcaveHull(ST_Collect(the_geom), 0.6) from pgr_drivingDistance(
        'SELECT gid AS id, source, target, cost_time AS cost FROM %s',
       (SELECT id
  FROM %s_vertices_pgr 
  ORDER BY st_setSRID(ST_MakePoint( %s, %s), 4326) <-> %s_vertices_pgr.the_geom
  LIMIT 1),%s, false
) AS pt JOIN %s_vertices_pgr rd ON pt.node = rd.id ))

      ;""" %((mode, mode, lng, lat, mode, time, mode)))
  user = cur.fetchall()[0][0]

  cur.close()
  conn.close()
  return user

def area_filter(gid, areamin, areamax,grossmin, grossmax, unbuiltmin, unbuiltmax):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid in %s AND area_fme BETWEEN %s and %s AND bgf_sum BETWEEN %s and %s AND  fl_unbeb_a BETWEEN %s and %s
      ;""" %(gid,areamin, areamax, grossmin, grossmax, unbuiltmin, unbuiltmax,))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def get_selected_feature_bound(gid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""select json_build_object(

  'left', (select min(ST_XMin(geom)) from parcel where gid =%s),
  'bottom', (select min(ST_YMin(geom)) from parcel where gid =%s),
  'right', (select max(ST_XMax(geom)) from parcel where gid =%s),
  'top', (select max(ST_YMax(geom)) from parcel where gid =%s)
    
    )
  
     ;""" %(gid, gid, gid, gid))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def get_geocoded_points():
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(geocoded_address.*)::json)
    )
  from geocoded_address
      ;""" )
  points = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return points

def get_geocoded_newspaper_points():
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(elbvertiefung.*)::json)
    )
  from elbvertiefung
      ;""" )
  points = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return points

def get_building(gid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(building.*)::json)
    )
  from building, (select * from parcel where parcel.gid in %s) as parcels where st_intersects(parcels.geom, building.geom)
      ;""" %(gid,))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def proximity_analysis(gid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
      update parcel set sm_dist=aoi.dist from (SELECT
        parcel.gid as pgid,
        closest_supermarket.geom as pgeom,
        closest_supermarket.gid as gid,
        closest_supermarket.dist
        FROM (select * from parcel where gid in %s) parcel 
        JOIN LATERAL 
          (SELECT
              gid, 
            geom,
              ST_Distance(supermarket.geom::geography, parcel.geom::geography) as dist
              FROM supermarket
              ORDER BY parcel.geom::geography <-> supermarket.geom::geography
            LIMIT 1
          ) as closest_supermarket ON true )aoi where aoi.pgid = parcel.gid;
      update parcel set ms_dist=aoi.dist from (SELECT
            parcel.gid as pgid,
            closest_metro.geom as pgeom,
            closest_metro.gid as gid,
            closest_metro.dist
          FROM (select * from parcel where gid in %s) parcel 
          JOIN LATERAL 
            (SELECT
                gid, 
              geom,
                ST_Distance(metro_station.geom::geography, parcel.geom::geography) as dist
                FROM metro_station
                ORDER BY parcel.geom::geography <-> metro_station.geom::geography
              LIMIT 1
            ) as closest_metro ON true )aoi where aoi.pgid = parcel.gid;
      UPDATE parcel w
            SET total_score = ((1-(1.00 * (w.sm_dist - x.Min_sm_dist) / x.sm_dist_Range))*0.5) + ((1-(1.00 * (w.ms_dist - x.Min_ms_dist) / x.ms_dist_Range))*0.5),
            sm_score = (1-(1.00 * (w.sm_dist - x.Min_sm_dist) / x.sm_dist_Range)),
            ms_score = (1-(1.00 * (w.ms_dist - x.Min_ms_dist) / x.ms_dist_Range))
        FROM
            (
                SELECT sm_dist, gid, ms_dist,
                    min(sm_dist) OVER () AS Min_sm_dist,
                    max(sm_dist) OVER () - min(sm_dist) OVER () AS sm_dist_Range,
                    min(ms_dist) OVER () AS Min_ms_dist,
                    max(ms_dist) OVER () - min(ms_dist) OVER () AS ms_dist_Range

                FROM parcel where gid in %s
            ) x 
        where w.gid=x.gid;
      select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid in %s
  ;""" %(gid,gid,gid, gid))
  points = cur.fetchall()[0][0]

  # apply changes to the database
  conn.commit()
  conn.close()
  return points

def proximity_scoring(supermarketWeight, metroWeight, apothekeWeight, krankenhausWeight, kitaWeight, gid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
     
      UPDATE parcel w
            SET total_score = ((1-(1.00 * (w.sm_dist - x.Min_sm_dist) / x.sm_dist_Range))*%s) + ((1-(1.00 * (w.ms_dist - x.Min_ms_dist) / x.ms_dist_Range))*%s) + ((1-(1.00 * (w.apotheke_dist - x.Min_apotheke_dist) / x.apotheke_dist_Range))*%s)+((1-(1.00 * (w.krankenhaus_dist - x.Min_krankenhaus_dist) / x.krankenhaus_dist_Range))*%s) +((1-(1.00 * (w.kita_dist - x.Min_kita_dist) / x.kita_dist_Range))*%s),
            sm_score = (1-(1.00 * (w.sm_dist - x.Min_sm_dist) / x.sm_dist_Range)),
            ms_score = (1-(1.00 * (w.ms_dist - x.Min_ms_dist) / x.ms_dist_Range)),
            apotheke_score = (1-(1.00 * (w.apotheke_dist - x.Min_apotheke_dist) / x.apotheke_dist_Range)),
            krankenhaus_score = (1-(1.00 * (w.krankenhaus_dist - x.Min_krankenhaus_dist) / x.krankenhaus_dist_Range)),
            kita_score = (1-(1.00 * (w.kita_dist - x.Min_kita_dist) / x.kita_dist_Range))
        FROM
            (
                SELECT sm_dist, gid, ms_dist, apotheke_dist, krankenhaus_dist, kita_dist,
                    min(sm_dist) OVER () AS Min_sm_dist,
                    max(sm_dist) OVER () - min(sm_dist) OVER () AS sm_dist_Range,
                    min(ms_dist) OVER () AS Min_ms_dist,
                    max(ms_dist) OVER () - min(ms_dist) OVER () AS ms_dist_Range,
                    min(apotheke_dist) OVER () AS Min_apotheke_dist,
                    max(apotheke_dist) OVER () - min(apotheke_dist) OVER () AS apotheke_dist_Range,
                    min(krankenhaus_dist) OVER () AS Min_krankenhaus_dist,
                    max(krankenhaus_dist) OVER () - min(krankenhaus_dist) OVER () AS krankenhaus_dist_Range,
                    min(kita_dist) OVER () AS Min_kita_dist,
                    max(kita_dist) OVER () - min(kita_dist) OVER () AS kita_dist_Range

                FROM parcel where gid in %s
            ) x 
        where w.gid=x.gid;
      select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid in %s
  ;""" %(supermarketWeight, metroWeight, apothekeWeight,krankenhausWeight, kitaWeight, gid,gid))
  points = cur.fetchall()[0][0]

  # apply changes to the database
  conn.commit()
  cur.close()
  conn.close()
  return points

def classification(table, att, table1, gid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg((%s."%s"))
    )
  from %s where gid in %s
      ;""" %(table,att,table1,gid))
  user = cur.fetchall()
  cur.close()
  conn.close()
  return user

def bivariate_classification(table, att1,  att2, gid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg((%s.%s, %s.%s ))
    )
  from %s where gid in %s
      ;""" %(table,att1,table, att2,table, gid))
  user = cur.fetchall()
  cur.close()
  conn.close()
  return user

def bivariate_class_assignment(att1,  att2, break10, break11, break20, break21, gid):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  update parcel
      set bivariateclass =   
      CASE  
			  WHEN %s <= %s AND %s <= %s THEN '00' 
			  WHEN %s > %s AND %s <= %s AND %s <= %s THEN '10'
			  WHEN %s >= %s AND %s <= %s THEN '20'
        WHEN %s <= %s AND %s > %s AND %s <= %s THEN '01'
        WHEN %s > %s AND %s <= %s AND %s > %s AND %s <= %s THEN '11'
        WHEN %s > %s AND %s > %s AND %s <= %s THEN '21'
        WHEN %s <= %s AND %s > %s THEN '02'
        WHEN %s > %s AND %s <= %s AND %s > %s THEN '12'
        WHEN %s > %s AND %s > %s THEN '22'
		  END 
      WHERE gid in %s;
      select json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
      )
      from parcel where gid in %s
      ;""" %(att1,break10,att2, break20, att1, break10, att1, break11, att2, break20, att1, break11, att2, break20, att1, break10, att2, break20, att2, break21, att1, break10, att1, break11,att2, break20, att2, break21, att1, break11, att2, break20, att2, break21, att1, break10, att2, break21, att1, break10, att1, break11, att2, break21, att1, break11, att2, break21, gid, gid, ))
  user = cur.fetchall()[0][0]
  conn.commit()
  cur.close()
  conn.close()
  return user


def criterial_filter(gid,att):
  conn = connect()
  cur = conn.cursor()
  
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid in %s %s 
      ;""" %(gid, att))
  user = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return user

def register_user(firstname, lastname, email, password):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
    insert into public.users (firstname, lastname, email, password_hashed, created_on) VALUES (%s, %s,%s, %s, now());
      """, (firstname, lastname, email, password))
  conn.commit()
  cur.close()
  conn.close()

def validate_user(email):
  conn = connect()
  cur = conn.cursor()
  cur.execute("SELECT * FROM users where email=%s", (email,))
  mail = cur.fetchall()
  cur.close()
  conn.close()
  return mail

def save_results_json(jsonfile, userid):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
    update users set results = COALESCE(results, '[]'::jsonb) || %s::jsonb
 where id = %s;
      """, (jsonfile, userid))
  conn.commit()
  cur.close()
  conn.close()

def saved_user_results(id):
  conn = connect()
  cur = conn.cursor()
  cur.execute("SELECT results FROM users where id=%s", (id,))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def delete_item_user_history(id, id2, id3, deleteItemName):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
    do $$
   
      BEGIN
        IF (select jsonb_array_length(results) from users where id = %s) =1
        THEN
          update users set results = null where id = %s;
      ELSE 
        UPDATE users u
          SET results = s.new_results
          FROM (
          SELECT
              id,
              jsonb_agg(elements.value) AS new_results
          FROM
              users,
              jsonb_array_elements(results) AS elements
          WHERE id= %s AND elements.value ->> 'name' != %s
          GROUP BY id
          ) s
          WHERE u.id = s.id;
      END IF;
      END
    $$
      """, (id, id2, id3, deleteItemName,))
  conn.commit()
  cur.close()
  conn.close()

def get_saved_parcels(gid):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid in %s
      ;""" %(gid,))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def update_user_history_item_description(name, modifiedDescription, id):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
    with result_description as (
    select ('{'||index-1||',description}')::text[] as path
      from users, jsonb_array_elements (results) with ordinality arr(item, index)
      where item->>'name'=%s
    )

    update users set results = jsonb_set(results, result_description.path, %s, false)
    from result_description
    where id=%s
      ;""", (name,modifiedDescription,id,))
  conn.commit()
  cur.close()
  conn.close()


def get_word_cloud(date):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  SELECT json_agg(json_build_object(
					'word', word,
					'frequency', frequency::INTEGER
					)
			   	)
  from elb_top20_keywords where date = %s;
  """ ,(date,))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def get_word_cloud_parliament(doc_num):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  SELECT json_agg(json_build_object(
					'word', word,
					'frequency', frequency::INTEGER
					)
			   	)
  from parlament_top20_keywords where file_number = %s;
  """ ,(doc_num,))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def get_liked_parcels(gid):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid in %s
      ;""" %(gid,))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def get_single_liked_parcel(gid):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid = %s
      ;""" %(gid,))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def get_geoparsing_date_filter(table, fieldname, date1,date2):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(%s.*)::json)
    )
  from %s WHERE %s >= '%s' AND  %s < '%s'
      ;""" %(table, table, fieldname, date1, fieldname, date2))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def geoparsing_topic_filter(query):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(geocoded_address.*)::json)
    )
  from geocoded_address WHERE %s 
      ;""" %(query))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result

def create_parcel_touch_test_table(gid):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
    DROP TABLE IF EXISTS parcel_touch_test;
    CREATE TABLE parcel_touch_test AS SELECT array[gid] ids, ST_GeometryN(geom, generate_series(1, ST_NumGeometries(geom))) AS geom  FROM parcel where gid in %s;
      ;""" %(gid,))

  conn.commit()
  cur.close()
  conn.close()
  return "ok"

def analyze_parcel_touch_test_table(gid, area1, area2,area3):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
    DROP TABLE IF EXISTS parcel_touch_test;
    CREATE TABLE parcel_touch_test AS SELECT array[gid] ids, ST_GeometryN(geom, generate_series(1, ST_NumGeometries(geom))) AS geom  FROM parcel where gid in %s;
    
    CREATE OR REPLACE FUNCTION reduce_joined_testpoly()
    RETURNS void
    AS $$
    DECLARE
      joined_row parcel_touch_test;
    BEGIN
      LOOP
        SELECT array_cat(a.ids, b.ids), st_union(a.geom, b.geom)
            INTO joined_row 
        FROM parcel_touch_test a INNER JOIN parcel_touch_test b
              on a.ids != b.ids
                  and ST_Touches(a.geom, b.geom) and a.geom && b.geom 
                  and st_area(a.geom::geography)<%s
                  and st_area(b.geom::geography)<%s
                  and ST_Relate(a.geom, b.geom)='FF2F11212'
            LIMIT 1;
        IF NOT FOUND THEN
              EXIT;
        END IF;
        INSERT INTO parcel_touch_test VALUES (joined_row.ids, joined_row.geom);
        DELETE FROM parcel_touch_test
            WHERE parcel_touch_test.ids <@ joined_row.ids 
              AND parcel_touch_test.ids != joined_row.ids;
      END LOOP;
      RETURN;
    END;
    $$ LANGUAGE plpgsql;

    SELECT reduce_joined_testpoly();

    SELECT jsonb_build_object(
    'type',     'FeatureCollection',
    'features', jsonb_agg(feature)
      )
      FROM (
        SELECT jsonb_build_object(
          'type',       'Feature',
          'geometry',   ST_AsGeoJSON(geom)::jsonb,
          'properties', to_jsonb(inputs) - 'geom'
        ) AS feature
        FROM (
          SELECT ids, st_area(geom::geography) as area, geom FROM parcel_touch_test where st_area(geom::geography)>%s
        ) inputs
      ) features;

      ;""" %(gid, area1, area2,area3,))

 
  
  result = cur.fetchall()[0][0]
  conn.commit()
  cur.close()
  conn.close()
  
  return result

def get_parcel_touch_test_table(area):
  conn = connect()
  cur = conn.cursor()
  cur.execute("""
  SELECT jsonb_build_object(
  'type',     'FeatureCollection',
  'features', jsonb_agg(feature)
)
FROM (
  SELECT jsonb_build_object(
    'type',       'Feature',
    'geometry',   ST_AsGeoJSON(geom)::jsonb,
    'properties', to_jsonb(inputs) - 'geom'
  ) AS feature
  FROM (
    SELECT ids, st_area(geom::geography) as area, geom FROM parcel_touch_test where st_area(geom::geography)>%s
  ) inputs
) features;

      ;""" %(area,))
  result = cur.fetchall()[0][0]
  cur.close()
  conn.close()
  return result