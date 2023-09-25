import json
import psycopg2
from psycopg2.extras import RealDictCursor
import time
import logging

while True:
    try:
        # host,database,username,password
        conn = psycopg2.connect(host="database", database="ligfinder",
                                user="postgres", password="XXX_POSTGRES_PASSWORD_XXX", port=5432, cursor_factory=RealDictCursor)
        cur = conn.cursor()
        print(" YEYYYYYY Connected to the database")
        break
    except Exception as error:
        print("I am unable to connect to the database")
        print(error)
        time.sleep(5)


def get_buildings(gid):
    # there is no buildigin dataset in the database. this is just a dummy function to test the connection
    cur.execute("SELECT * FROM parcel where gid=%s", (gid,))
    building = cur.fetchall()
    return building  # done


def get_table_names():
    try:
        cur.execute("""select table_name from information_schema.columns where column_name = 'geom'
        AND table_name NOT in ('bike_network', 'counties_daily', 'drive_network', 'parcel', 'building', 
                'walk_network', 'geocoded_address', 'counties', 'pop', 'elbvertiefung',	'bezirke', 'gemarkungen', 'stadtteile', 'statistischegebiete')  """)
        user = cur.fetchall()
        print(user)
        return user
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None  # done


def get_table(tableName):
    try:
        cur.execute("""select json_build_object(
    'name', '%s', 'oid', (SELECT '%s'::regclass::oid), 
                'left', (select min(ST_XMin(geom)) from %s), 
                'bottom', (select min(ST_YMin(geom)) from %s), 
                'right', (select max(ST_XMax(geom)) from %s), 
                'top', (select max(ST_YMax(geom)) from %s),
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(t.*)::json)
        )
        from %s
        as t;""" % (tableName, tableName, tableName, tableName, tableName, tableName, tableName))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None  # done


def get_feature(tableName, featureid):
    try:
        cur.execute("""select json_build_object(
        'tablename', '%s',
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(t.*)::json)
        ) from %s as t where gid = %s;""" % (tableName, tableName, featureid))
        result = cur.fetchone()
        # print(result["json_build_object"])
        print("*******************")
        return result["json_build_object"]
        # return None
    except Exception as error:
        logging.error(f"!!! Error from db.py: {error}")
        return None  # done


def get_union_features(tableName, featureid):
    try:
        cur.execute("""
                    select st_asgeojson(st_union(geom)) from %s where gid in %s
                    ;""" % (tableName, featureid))
        # result = cur.fetchall() # it might give error when there is more than 1
        result = cur.fetchone()
        # print(result['st_asgeojson'])

        return result['st_asgeojson']
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def get_selected_feature(tableName, featureid):

    cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from (select * from %s where gid = %s ) as foo, parcel  where ST_Intersects(parcel.geom, foo.geom)
      ;""" % (tableName, featureid))
    user = cur.fetchall()[0][0]

    return user

# below is not used by view.py
# def get_selected_features(tableName, featureid):
#     try:
#         cur.execute("""select json_build_object(
#         'type', 'FeatureCollection',
#         'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
#         )
#         from (select * from %s where gid in %s ) as foo, parcel  where ST_Intersects(parcel.geom, foo.geom)
#           ;""" % (tableName, featureid))
#         user = cur.fetchall()[0][0]
#         return user
#     except Exception as error:
#         logging.error(f"!!! Error : {error}")
#         return None


def get_geom_aoi(geom):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
          )
        from parcel where ST_Intersects(parcel.geom, ST_GeomFromGeoJSON('%s'))
            ;""" % (geom))
        aoi_geom = cur.fetchone()
        return aoi_geom["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def get_iso_aoi(mode, lng, lat, time):
    try:
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
      ) AS pt JOIN %s_vertices_pgr rd ON pt.node = rd.id ) as iso;""" % (mode, mode, lng, lat, mode, time, mode))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def spatial_union(geom1, geom2):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(merged.*)::json)
          )

        from (select ST_Union(ST_GeomFromGeoJSON('%s'), ST_GeomFromGeoJSON('%s'))) AS merged
            ;""" % (geom1, geom2))
        result = cur.fetchone()
        return result["json_build_object"]

        # user = cur.fetchall()[0][0]
        # return user
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def spatial_intersection(geom1, geom2):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(intersected.*)::json)
          )

        from (select ST_Intersection(ST_GeomFromGeoJSON('%s'), ST_GeomFromGeoJSON('%s'))) AS intersected
            ;""" % (geom1, geom2))
        result = cur.fetchone()
        return result["json_build_object"]
        # user = cur.fetchall()[0][0]
        # return user
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def get_iso_parcel(mode, lng, lat, time):

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

      ;""" % ((mode, mode, lng, lat, mode, time, mode)))
    user = cur.fetchall()[0][0]

    return user


def area_filter(gid, areamin, areamax, grossmin, grossmax, unbuiltmin, unbuiltmax):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
          )
        from parcel where gid in %s AND area_fme BETWEEN %s and %s AND bgf_sum BETWEEN %s and %s AND  fl_unbeb_a BETWEEN %s and %s
            ;""" % (gid, areamin, areamax, grossmin, grossmax, unbuiltmin, unbuiltmax,))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def get_selected_feature_bound(gid):
    try:
        cur.execute("""select json_build_object(
        'left', (select min(ST_XMin(geom)) from parcel where gid =%s),
        'bottom', (select min(ST_YMin(geom)) from parcel where gid =%s),
        'right', (select max(ST_XMax(geom)) from parcel where gid =%s),
        'top', (select max(ST_YMax(geom)) from parcel where gid =%s)
          )  
        ;""" % (gid, gid, gid, gid))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def proximity_analysis(gid):
    try:
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
          ;""" % (gid, gid, gid, gid))

        points = cur.fetchall()[0][0]
        # apply changes to the database
        conn.commit()
        return points
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def proximity_scoring(supermarketWeight, metroWeight, apothekeWeight, krankenhausWeight, kitaWeight, gid):
    """
    For next phase, we need to add more weights for other proximity analysis. It should be more flexible.
    1- calculate dist_Range for each proximity analysis
    2- calculate score for each proximity analysis and update parcel dataset
    3- get the updated parcel dataset and send it as a json to the frontend
    """
    try:
        cur.execute("""     
          UPDATE parcel w
                SET total_score = ((1-(1.00 * (w.sm_dist - x.Min_sm_dist) / x.sm_dist_Range))*%s) 
                    + ((1-(1.00 * (w.ms_dist - x.Min_ms_dist) / x.ms_dist_Range))*%s) 
                    + ((1-(1.00 * (w.apotheke_dist - x.Min_apotheke_dist) 
                    / x.apotheke_dist_Range))*%s)+((1-(1.00 * (w.krankenhaus_dist - x.Min_krankenhaus_dist) 
                    / x.krankenhaus_dist_Range))*%s)
                    +((1-(1.00 * (w.kita_dist - x.Min_kita_dist) / x.kita_dist_Range))*%s),
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
      ;""" % (supermarketWeight, metroWeight, apothekeWeight, krankenhausWeight, kitaWeight, gid, gid))
        result = cur.fetchone()
        conn.commit()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def classification(table, att, table1, gid):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg((%s."%s"))
          )
        from %s where gid in %s
            ;""" % (table, att, table1, gid))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def bivariate_classification(table, att1,  att2, gid):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg((%s.%s, %s.%s ))
          )
        from %s where gid in %s
            ;""" % (table, att1, table, att2, table, gid))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def bivariate_class_assignment(att1,  att2, break10, break11, break20, break21, gid):
    try:
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
            ;""" % (att1, break10, att2, break20, att1, break10, att1, break11, att2, break20, att1, break11, att2, break20, att1, break10, att2, break20, att2, break21, att1, break10, att1, break11, att2, break20, att2, break21, att1, break11, att2, break20, att2, break21, att1, break10, att2, break21, att1, break10, att1, break11, att2, break21, att1, break11, att2, break21, gid, gid, ))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def criterial_filter(gid, att):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
          )
        from parcel where gid in %s %s 
            ;""" % (gid, att))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def get_liked_parcels(gid):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
          )
        from parcel where gid in %s
            ;""" % (gid,))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def get_single_liked_parcel(gid):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
          )
        from parcel where gid = %s
            ;""" % (gid,))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def analyze_parcel_touch_test_table(gid, area1, area2, area3):
    """
    We got error at the end of the function.  
    DB retunr psycopg2.extras.RealDictRow datatype so we need to convert it to jsonb_build_object
    """
    try:
        cur.execute("""
        DROP TABLE IF EXISTS parcel_touch_test;
        CREATE TABLE parcel_touch_test AS SELECT array[gid] ids, ST_GeometryN(geom, generate_series(1, ST_NumGeometries(geom))) 
                    AS geom  FROM parcel where gid in %s;
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

          ;""" % (gid, area1, area2, area3,))
        result = cur.fetchone()
        return result['jsonb_build_object']
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None
## --------------------------------------- UNUSED FUNCTIONS BELOW --------------------------------------- ##


def get_geocoded_points():
    """
    postgres json_build_object vs jsonb_build_object
    """
    try:
        cur.execute("""
        select json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(geocoded_address.*)::json)
        )
        from geocoded_address
          ;""")
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None
# done


def get_geocoded_newspaper_points():
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(elbvertiefung.*)::json)
          )
        from elbvertiefung
            ;""")
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None
# done


def get_word_cloud(date):
    try:
        cur.execute("""
        SELECT json_agg(json_build_object(
                'word', word,
                'frequency', frequency::INTEGER))
        from elb_top20_keywords where date = %s;
        """, (date,))
        result = cur.fetchone()
        return result["json_agg"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None
# done


def get_word_cloud_parliament(doc_num):
    try:
        print(doc_num)
        cur.execute("""
        SELECT json_agg(json_build_object(
                'word', word,
                'frequency', frequency::INTEGER
                )
                )
        from parlament_top20_keywords where file_number = %s;
        """, (doc_num,))
        result = cur.fetchone()
        return result["json_agg"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def geoparsing_topic_filter(query):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(geocoded_address.*)::json)
          )
        from geocoded_address WHERE %s 
            ;""" % (query))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


def get_geoparsing_date_filter(table, fieldname, date1, date2):
    try:
        cur.execute("""
        select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(%s.*)::json)
          )
        from %s WHERE %s >= '%s' AND  %s < '%s'
      ;""" % (table, table, fieldname, date1, fieldname, date2))
        result = cur.fetchone()
        return result["json_build_object"]
    except Exception as error:
        logging.error(f"!!! Error : {error}")
        return None


# below unimplemented functions are not used by view.py
def get_building(gid):
    cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(building.*)::json)
    )
  from building, (select * from parcel where parcel.gid in %s) as parcels where st_intersects(parcels.geom, building.geom)
      ;""" % (gid,))
    user = cur.fetchall()[0][0]
    return user


def register_user(firstname, lastname, email, password):
    cur.execute("""
    insert into public.users (firstname, lastname, email, password_hashed, created_on) VALUES (%s, %s,%s, %s, now());
      """, (firstname, lastname, email, password))
    conn.commit()


def get_users(username, password):
    cur.execute(
        """SELECT * FROM users where username=%s AND password=%s""", (username, password,))
    user = cur.fetchall()
    return user


def validate_user(email):

    cur.execute("SELECT * FROM users where email=%s", (email,))
    mail = cur.fetchall()

    return mail


def save_results_json(jsonfile, userid):

    cur.execute("""
    update users set results = COALESCE(results, '[]'::jsonb) || %s::jsonb
 where id = %s;
      """, (jsonfile, userid))
    conn.commit()


def saved_user_results(id):

    cur.execute("SELECT results FROM users where id=%s", (id,))
    result = cur.fetchall()[0][0]

    return result


def delete_item_user_history(id, id2, id3, deleteItemName):

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


def get_saved_parcels(gid):

    cur.execute("""
  select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(parcel.*)::json)
    )
  from parcel where gid in %s
      ;""" % (gid,))
    result = cur.fetchall()[0][0]

    return result


def update_user_history_item_description(name, modifiedDescription, id):

    cur.execute("""
    with result_description as (
    select ('{'||index-1||',description}')::text[] as path
      from users, jsonb_array_elements (results) with ordinality arr(item, index)
      where item->>'name'=%s
    )

    update users set results = jsonb_set(results, result_description.path, %s, false)
    from result_description
    where id=%s
      ;""", (name, modifiedDescription, id,))
    conn.commit()


def create_parcel_touch_test_table(gid):

    cur.execute("""
    DROP TABLE IF EXISTS parcel_touch_test;
    CREATE TABLE parcel_touch_test AS SELECT array[gid] ids, ST_GeometryN(geom, generate_series(1, ST_NumGeometries(geom))) AS geom  FROM parcel where gid in %s;
      ;""" % (gid,))

    conn.commit()

    return "ok"
