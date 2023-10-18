import json
from fastapi import FastAPI, Response, status, HTTPException
from fastapi import Body, Depends
from fastapi.middleware.cors import CORSMiddleware

from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import time
import mapclassify
from app.db import (get_buildings, get_table_names, get_table, get_feature, get_selected_feature,
                    get_geom_aoi, get_iso_aoi, get_iso_parcel, area_filter, get_selected_feature_bound, get_geocoded_points, get_geocoded_newspaper_points, get_building,
                    proximity_analysis, classification, bivariate_classification, bivariate_class_assignment, proximity_scoring, criterial_filter, validate_user, register_user,
                    save_results_json, saved_user_results, delete_item_user_history, update_user_history_item_description, get_saved_parcels, get_word_cloud, get_word_cloud_parliament,
                    get_liked_parcels, get_single_liked_parcel, spatial_union, get_union_features, spatial_intersection, get_geoparsing_date_filter, geoparsing_topic_filter,
                    create_parcel_touch_test_table, analyze_parcel_touch_test_table, get_geocoded_elbe_points, get_word_cloud_elbe, elbe_topic_filter)
"""
deleted functions: get_selected_features, get_parcel_touch_test_table
"""
from app.routers import auth
from app import schema
from fastapi.responses import JSONResponse

app = FastAPI()
# app.include_router(auth.router)
# TODO replace origin
origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/table-names', status_code=status.HTTP_200_OK)
async def table_names():
    table_names = get_table_names()
    if not table_names:
        raise HTTPException(
            status_code=404, detail=f"Table names not found")
    result = []
    for table in table_names:
        d = dict()
        d['id'] = table_names.index(table)
        d['name'] = table['table_name']
        result.append(d)
    return result  # done


@app.post('/add-table', status_code=status.HTTP_200_OK)
async def add_table(payload: schema.TableNamePayload):
    layer = {}
    tableName = payload.tablename
    layer = get_table(tableName)
    if not layer:
        raise HTTPException(
            status_code=404, detail=f"Table with name {tableName} not found")
    return layer  # done


@app.post('/add-feature', status_code=status.HTTP_200_OK)
async def add_feature(data: schema.FeatureIdPayload):
    tableName = data.tablename
    featureId = data.featureid
    layer = get_feature(tableName, featureId)
    if not layer:
        raise HTTPException(
            status_code=500, detail=f"Feature with id {featureId} not found")
    return layer  # done


@app.post('/get-isochrone-aoi', status_code=status.HTTP_200_OK)
async def get_isochrone_aoi(data: dict):
    time = float(data["payload"]["time"])*60
    center = data["payload"]["center"]
    lng = float(center["lng"])
    lat = float(center["lat"])
    mode = data["payload"]["mode"]
    return get_iso_aoi(mode, lng, lat, time)  # done


@app.post('/get-aois', status_code=status.HTTP_200_OK)
async def get_aois(data: dict):
    try:
        nonEmptyData = []
        for i in range(len(data["AOIs"])):
            if (data["AOIs"][i]["data"] is not None):
                nonEmptyData.append(i)
        adminLayer = None
        adminUnionLayer = None
        if data["AOIs"][0]["data"] is not None:
            featureid = []
            tablename = data["AOIs"][0]["data"][0]['table']
            for i in data["AOIs"][0]["data"]:
                featureid.append(int(i['id']))
            featureid = tuple(featureid)
            if (len(featureid) == 1):
                adminLayer = get_feature(tablename, featureid[0])
            else:
                adminUnionLayer = get_union_features(tablename, featureid)
        if len(nonEmptyData) == 3:
            if adminLayer is not None:
                union = spatial_union(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(
                    data["AOIs"][2]["data"]["features"][0]["geometry"]))
                final_union = spatial_union(json.dumps(union["features"][0]["geometry"]), json.dumps(
                    adminLayer["features"][0]["geometry"]))
                result = get_geom_aoi(json.dumps(
                    final_union["features"][0]["geometry"]))

                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result
            elif adminUnionLayer is not None:
                union = spatial_union(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(
                    data["AOIs"][2]["data"]["features"][0]["geometry"]))
                final_union = spatial_union(json.dumps(
                    union["features"][0]["geometry"]), adminUnionLayer)
                result = get_geom_aoi(json.dumps(
                    final_union["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result

        elif len(nonEmptyData) == 2:
            if adminLayer is not None:
                union = spatial_union(json.dumps(adminLayer["features"][0]["geometry"]), json.dumps(
                    data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
                result = get_geom_aoi(json.dumps(
                    union["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result

            elif adminUnionLayer is not None:
                union = spatial_union(adminUnionLayer, json.dumps(
                    data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
                result = get_geom_aoi(json.dumps(
                    union["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result

            else:
                union = spatial_union(json.dumps(data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"]), json.dumps(
                    data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
                result = get_geom_aoi(json.dumps(
                    union["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result

        elif len(nonEmptyData) == 1:
            if adminLayer is not None:
                result = get_geom_aoi(json.dumps(
                    adminLayer["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result

            elif adminUnionLayer is not None:
                result = get_geom_aoi(adminUnionLayer)
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result

            else:
                result = get_geom_aoi(json.dumps(
                    data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Exception {error.__cause__}")

# done


@app.post('/get-intersect_aois', status_code=status.HTTP_200_OK)
async def get_intersect_aois(data: dict):
    nonEmptyData = []
    for i in range(len(data["AOIs"])):
        if (data["AOIs"][i]["data"] is not None):
            nonEmptyData.append(i)
    adminLayer = None
    adminUnionLayer = None
    if data["AOIs"][0]["data"] is not None:
        featureid = []
        tablename = data["AOIs"][0]["data"][0]['table']
        for i in data["AOIs"][0]["data"]:
            featureid.append(int(i['id']))
        featureid = tuple(featureid)
        if (len(featureid) == 1):

            adminLayer = get_feature(tablename, featureid[0])
        else:
            adminUnionLayer = get_union_features(tablename, featureid)

    if len(nonEmptyData) == 1:
        if adminLayer is not None:
            result = get_geom_aoi(json.dumps(
                adminLayer["features"][0]["geometry"]))
            if result is None:
                raise HTTPException(
                    status_code=404, detail=f"AOI not found")
            return result

        elif adminUnionLayer is not None:
            result = get_geom_aoi(adminUnionLayer)
            if result is None:
                raise HTTPException(
                    status_code=404, detail=f"AOI not found")
            return result

        else:
            result = get_geom_aoi(json.dumps(
                data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"]))
            if result is None:
                raise HTTPException(
                    status_code=404, detail=f"AOI not found")
            return result

    elif len(nonEmptyData) == 2:
        if adminLayer is not None:

            intersection = spatial_intersection(json.dumps(adminLayer["features"][0]["geometry"]), json.dumps(
                data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            result = get_geom_aoi(json.dumps(
                intersection["features"][0]["geometry"]))
            if result is None:
                raise HTTPException(
                    status_code=404, detail=f"AOI not found")
            return result

        elif adminUnionLayer is not None:
            intersection = spatial_intersection(adminUnionLayer, json.dumps(
                data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            result = get_geom_aoi(json.dumps(
                intersection["features"][0]["geometry"]))
            if result is None:
                raise HTTPException(
                    status_code=404, detail=f"AOI not found")
            return result

        else:
            intersection = spatial_intersection(json.dumps(data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"]), json.dumps(
                data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            result = get_geom_aoi(json.dumps(
                intersection["features"][0]["geometry"]))
            if result is None:
                raise HTTPException(
                    status_code=404, detail=f"AOI not found")
            return result

    if len(nonEmptyData) == 3:
        if adminLayer is not None:
            intersection1 = spatial_intersection(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(
                data["AOIs"][2]["data"]["features"][0]["geometry"]))
            intersection2 = spatial_intersection(json.dumps(
                data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(adminLayer["features"][0]["geometry"]))
            intersection3 = spatial_intersection(json.dumps(
                data["AOIs"][2]["data"]["features"][0]["geometry"]), json.dumps(adminLayer["features"][0]["geometry"]))

            if len(intersection1['features']) != 0 and len(intersection2['features']) != 0 and len(intersection3['features']) != 0:
                final_intersection = spatial_intersection(json.dumps(
                    intersection1["features"][0]["geometry"]), json.dumps(adminLayer["features"][0]["geometry"]))
                result = get_geom_aoi(json.dumps(
                    final_intersection["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result

        elif adminUnionLayer is not None:
            intersection1 = spatial_intersection(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(
                data["AOIs"][2]["data"]["features"][0]["geometry"]))
            intersection2 = spatial_intersection(json.dumps(
                data["AOIs"][1]["data"]["features"][0]["geometry"]), adminUnionLayer)
            intersection3 = spatial_intersection(json.dumps(
                data["AOIs"][2]["data"]["features"][0]["geometry"]), adminUnionLayer)

            if len(intersection1['features']) != 0 and len(intersection2['features']) != 0 and len(intersection3['features']) != 0:
                final_intersection = spatial_intersection(json.dumps(
                    intersection1["features"][0]["geometry"]), adminUnionLayer)
                result = get_geom_aoi(json.dumps(
                    final_intersection["features"][0]["geometry"]))
                if result is None:
                    raise HTTPException(
                        status_code=404, detail=f"AOI not found")
                return result  # done


@app.post('/get-selected-feature-bound', status_code=status.HTTP_200_OK)
async def get_feature_bbox(data: dict):
    featureGid = int(data['featureGid'])
    result = get_selected_feature_bound(featureGid)
    if result is None:
        raise HTTPException(
            status_code=404, detail=f"AOI not found")
    return result  # done


@app.post('/get-proximity-scoring-result', status_code=status.HTTP_200_OK)
async def get_proximity_score(data: dict):
    supermarketWeight = data['parameters'][0]['weight']
    metroWeight = data['parameters'][1]['weight']
    apothekeWeight = data['parameters'][2]['weight']
    krankenhausWeight = data['parameters'][3]['weight']
    kitaWeight = data['parameters'][4]['weight']
    featureIds = data['foi']
    featureid = []
    for gid in featureIds:
        featureid.append(int(gid))
    featureid = tuple(featureid)
    scores = []
    data = proximity_scoring(supermarketWeight, metroWeight,
                             apothekeWeight, krankenhausWeight, kitaWeight, featureid)
    if data is None:
        raise HTTPException(
            status_code=404, detail=f"Scores is not found")

    for i in data['features']:
        scores.append(i['properties']['total_score'])
    classes = mapclassify.Quantiles(scores, k=5).bins
    breaks = []
    for i in classes:
        breaks.append(i)
    lowerbound = min(scores)
    return {'data': data, 'lowerbound': lowerbound, 'breaks': breaks}


@app.post('/classify', status_code=status.HTTP_200_OK)
async def classify(data: dict):
    if data["selectedChoroplethMethod"] == "Univariate":
        try:
            featureIds = data['gids']
            featureid = []
            for gid in featureIds:
                featureid.append(int(gid))
            featureid = tuple(featureid)
            if data['selectedLayer'] == "foi" or data['selectedLayer'] == "results":
                data['selectedLayer'] = "parcel"
            jsonfile = classification(
                data['selectedLayer'], data['attribute1'], data['selectedLayer'], featureid)

            if jsonfile is None:
                raise HTTPException(
                    status_code=404, detail=f"DB query returns None")

            attColumn = jsonfile['features']
            attColumn = [i for i in attColumn if i != None]
            classificationMethod = data['selectedClassificationMethod']
            breaks = []
            classes = []
            if classificationMethod == "Quantiles":
                classes = mapclassify.Quantiles(
                    attColumn, k=data['selectedClass']).bins
            elif classificationMethod == "NaturalBreaks":
                classes = mapclassify.NaturalBreaks(
                    attColumn, k=data['selectedClass']).bins
            elif classificationMethod == "JenksCaspall":
                classes = mapclassify.JenksCaspall(
                    attColumn, k=data['selectedClass']).bins
            elif classificationMethod == "EqualInterval":
                classes = mapclassify.EqualInterval(
                    attColumn, k=data['selectedClass']).bins

            for i in classes:
                breaks.append(i)

            lowerbound = min(attColumn)
            return {'layername': data['selectedLayer'], 'lowerbound': lowerbound, 'breaks': breaks, 'attribute': data['attribute1']}
        except Exception as error:
            raise HTTPException(
                status_code=404, detail=f"Exception {error.__cause__}")
    else:
        raise HTTPException(
            status_code=404, detail=f"Classification method is not found")
# done


@app.post('/bivariate-classify', status_code=status.HTTP_200_OK)
async def bivariate_classify(data: dict):
    if data["selectedChoroplethMethod"] == "Bivariate":
        try:
            featureIds = data['gids']
            featureid = []
            for gid in featureIds:
                featureid.append(int(gid))
            featureid = tuple(featureid)
            if data['selectedLayer'] == "foi":
                data['selectedLayer'] = "parcel"

            jsonfile = bivariate_classification(
                data['selectedLayer'], data['attribute1'], data['attribute2'], featureid)

            if jsonfile is None:
                raise HTTPException(
                    status_code=404, detail=f"DB query returns None")

            att1 = []
            att2 = []
            for f in jsonfile["features"]:
                att1.append(f["f1"])
                att2.append(f["f2"])
            classificationMethod = data['selectedClassificationMethod']
            breaks1 = []
            classes1 = []
            breaks2 = []
            classes2 = []

            if classificationMethod == "Quantiles":
                classes1 = mapclassify.Quantiles(att1, k=3).bins
                classes2 = mapclassify.Quantiles(att2, k=3).bins
            elif classificationMethod == "NaturalBreaks":
                classes1 = mapclassify.NaturalBreaks(att1, k=3).bins
                classes2 = mapclassify.NaturalBreaks(att2, k=3).bins
            elif classificationMethod == "JenksCaspall":
                classes1 = mapclassify.JenksCaspall(att1, k=3).bins
                classes2 = mapclassify.JenksCaspall(att2, k=3).bins
            elif classificationMethod == "EqualInterval":
                classes1 = mapclassify.EqualInterval(att1, k=3).bins
                classes2 = mapclassify.EqualInterval(att2, k=3).bins

            for i in classes1:
                breaks1.append(i)

            for i in classes2:
                breaks2.append(i)
            class_assignment = bivariate_class_assignment(
                data['attribute1'], data['attribute2'], breaks1[0], breaks1[1], breaks2[0], breaks2[1], featureid)
            return class_assignment
        except Exception as error:
            raise HTTPException(
                status_code=404, detail=f"Exception {error.__cause__}")
    else:
        raise HTTPException(
            status_code=404, detail=f"Classification method is not found")
# done


@app.post('/set-criteria-filter', status_code=status.HTTP_200_OK)
async def set_criteria_filter(data: dict):
    try:
        excludeTags = data["excludeTags"]
        includeTags = data["includeTags"]
        operator = data["operator"]
        queryString = ""
        orquery = ""
        if (operator == "AND"):
            for i in includeTags:
                if i["filterType"] == "prozent":
                    queryString += "and" + " " + i["columns"] + ">" + "0" + " "
                else:
                    # i["columns"] = i["columns"].split(',')
                    for j in i["columns"]:
                        queryString += "and" + " " + j + \
                            "=" + "'" + i["value"] + "'" + " "
            for i in excludeTags:
                if i["filterType"] == "prozent":
                    queryString += "and" + " " + \
                        i["columns"] + " " "in" + " " + "(0, null)" + " "
                else:
                    # i["columns"] = i["columns"].split(',')
                    for j in i["columns"]:
                        queryString += "and" + " " + j + " " + \
                            "is distinct from" + " " + \
                            "'" + i["value"] + "'" + " "
        elif (operator == "OR"):

            for i in includeTags:
                if i["filterType"] == "prozent":
                    orquery += i["columns"] + ">" + "0" + " " + "or" + " "
                else:
                    # i["columns"] = i["columns"].split(',')
                    for j in i["columns"]:
                        orquery += j + " " + "in" + \
                            "(" + "'" + i["value"] + "'" + ")" + \
                            " " + "or" + " "
            for i in excludeTags:
                if i["filterType"] == "prozent":
                    queryString += "and" + " " + \
                        i["columns"] + " " "in" + " " + "(0, null)" + " "
                else:
                    # i["columns"] = i["columns"].split(',')
                    for j in i["columns"]:
                        queryString += "and" + " " + j + " " + \
                            "is distinct from" + " " + \
                            "'" + i["value"] + "'" + " "

            if orquery:
                orquery = orquery[:-3]
                queryString += "and" + " " + "("+orquery+")"
        featureIds = data['featureIds']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid = tuple(featureid)
        result = criterial_filter(featureid, queryString)
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Exception {error.__cause__}")
# done


@app.post('/get-liked-parcels', status_code=status.HTTP_200_OK)
async def get_liked_parcel(data: dict):
    featureIds = data['gids']
    featureid = []
    for gid in featureIds:
        featureid.append(int(gid))
    featureid = tuple(featureid)
    if (len(featureid) == 1):
        result = get_single_liked_parcel(featureid[0])
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result

    else:
        result = get_liked_parcels(featureid)
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
# done


@app.post('/get-touching-parcels', status_code=status.HTTP_200_OK)
async def get_touching_parcels(data: dict):
    try:
        area_threshould = float(data['area'])
        joined_parcel_data = analyze_parcel_touch_test_table(
            tuple(data['gids']), area_threshould, area_threshould, area_threshould)
        if joined_parcel_data is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return joined_parcel_data
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")

### ------------------ Geoparsing ------------------ ###


@app.get('/get-geocoded-points', status_code=status.HTTP_200_OK)
async def get_geocode_points():
    try:
        result = get_geocoded_points()
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.get('/get-geocoded-newspaper-points', status_code=status.HTTP_200_OK)
async def get_geocode_newspaper_points():
    try:
        result = get_geocoded_newspaper_points()
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.get('/get-geocoded-elbe-points', status_code=status.HTTP_200_OK)
async def get_geocode_newspaper_points():
    try:
        result = get_geocoded_elbe_points()
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.post('/get-word-frequency', status_code=status.HTTP_200_OK)
async def get_word_cloudd(data: dict):
    try:
        result = get_word_cloud(data["date"])
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.post('/get-word-frequency-parliament', status_code=status.HTTP_200_OK)
async def get_word_cloudd(data: dict):
    try:
        result = get_word_cloud_parliament(data["docNum"])
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.post('/get-word-frequency-elbe', status_code=status.HTTP_200_OK)
async def get_word_cloudd(data: dict):
    try:
        result = get_word_cloud_elbe(data["row_num"])
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.post('/geoparsing-topic-filter', status_code=status.HTTP_200_OK)
async def topic_filter(data: dict):
    try:
        whereClause = ""
        for i in data["topics"]:
            i = i.lower()
            if data["topicQueryMode"] == "AND":
                whereClause += 'and' + ' ' + '"' + i + '"' + ' ' + "is" + ' ' + "true" + ' '
            elif data["topicQueryMode"] == "OR":
                whereClause += 'or' + ' ' + '"' + i + '"' + ' ' + "is" + ' ' + "true" + ' '
        query = whereClause.split()
        # remove first word and join the remaning words
        query = " ".join(query[1:])
        result = geoparsing_topic_filter(query)
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.post('/elbe-topic-filter', status_code=status.HTTP_200_OK)
async def elbe_topic_filter_func(data: dict):
    try:
        whereClause = ""
        for i in data["topics"]:
            i = i.lower()
            if data["topicQueryMode"] == "AND":
                whereClause += f"and LOWER(topic_name) LIKE '%{i}%' "
            elif data["topicQueryMode"] == "OR":
                whereClause += f"or LOWER(topic_name) LIKE '%{i}%' "
        query = whereClause.split()
        # remove first word and join the remaning words
        query = " ".join(query[1:])
        result = elbe_topic_filter(query)
        if result is None:
            raise HTTPException(
                status_code=404, detail=f"DB query returns None")
        return result
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")


@app.post('/geoparsing-date-filter', status_code=status.HTTP_200_OK)
async def geoparsing_date_filter(data: dict):
    try:
        if data["datasetMode"] == 'parliament':
            return (get_geoparsing_date_filter('geocoded_address', 'date', data["dates"][0], data["dates"][1]))
        elif data["datasetMode"] == 'newspaper':
            return (get_geoparsing_date_filter('elbvertiefung', 'date', data["dates"][0], data["dates"][1]))
        elif data["datasetMode"] == 'elbe':
            return (get_geoparsing_date_filter('geocoded_elbewochenblat', 'date', data["dates"][0], data["dates"][1]))
    except Exception as error:
        raise HTTPException(
            status_code=404, detail=f"Exception {error.__cause__}")
