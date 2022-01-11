from flask import Flask, request, jsonify, json, Response
import mapclassify
from RestAPI import app
from .db import get_buildings, get_users, get_table_names, get_table, get_feature,get_selected_featuress,get_selected_feature,get_geom_aoi,get_iso_aoi,get_iso_parcel,area_filter,get_selected_feature_bound, get_geocoded_points, get_building, proximity_analysis, classification

@app.route('/', methods=["GET", "POST"])
def home():
    ggggid =2
    print(get_buildings(ggggid))
    return "welcome"

@app.route('/login', methods=["GET", "POST"])
def login():
    user_credentials=''
    if request.method == 'POST':
        user_credentials = request.get_json()
        
    username = user_credentials['username']
    password = user_credentials['password']
    if len(get_users(username,password)) == 1:
        return {"isUser":True}
    else:
        print("Oops! Incorrect Username or Password!")
        return {"isUser":False}


@app.route('/table-names', methods=["GET", "POST"])
def table_names():
    if request.method == "GET":
        table_names = get_table_names()
        result = []
        for table in table_names:
            d = dict()
            d['id'] = table_names.index(table)
            d['name'] = table[0]
            result.append(d)
        subjects = json.dumps(result, indent=4)
        return json.dumps(json.loads(subjects))

@app.route('/add-table', methods=["GET", "POST"])
def add_table():
    layer= {}
    if request.method=='POST':
        data = request.get_json()
        tableName = data['tablename']
        layer = jsonify(get_table(tableName))
        print(layer)
    return layer

@app.route('/add-feature', methods=["GET", "POST"])
def add_feature():
    
    if request.method=='POST':
        data = request.get_json()
        tableName = data['tablename']
        featureId = data['featureid']
        layer = jsonify(get_feature(tableName, featureId))
        print(layer)
    return layer

@app.route('/get-selected-features', methods=["GET", "POST"])
def get_selected_features():
    if request.method=='POST':
        data = request.get_json()['selectedFeatures']
        #print(data)
        featureid = []
        tablename= data[0]['table']
        for i in data:
            featureid.append(int(i['id']))
        featureid= tuple(featureid)
        print(len(featureid))
    if(len(featureid)==1):

        return jsonify(get_selected_feature(tablename, featureid[0] ))
    else:
        return jsonify(get_selected_featuress(tablename, featureid ))

@app.route('/get-geometry-aoi', methods=["GET", "POST"])
def get_geometry_aoi():
    
    if request.method=='POST':
        data = request.get_json()
        geom = data["data"]["features"][0]["geometry"]
        geom1 = data["data"]
        #print(geom)
        #print(geom1)
        #print(get_geom_aoi(json.dumps(geom)))
    return jsonify(get_geom_aoi(json.dumps(geom)))

@app.route('/get-isochrone-aoi', methods=["GET", "POST"])
def get_isochrone_aoi():
    
    if request.method=='POST':
        data = request.get_json()
        time = float(data["payload"]["time"])*60
        center = data["payload"]["center"]["coordinates"]
        lng = float(center[0])
        lat = float(center[1])
        print(jsonify(get_iso_aoi(lng, lat, time)))
    return json.loads(json.dumps(get_iso_aoi(lng, lat, time)))

@app.route('/get-isochrone-parcel', methods=["GET", "POST"])
def get_isochrone_parcel():
    
    if request.method=='POST':
        data = request.get_json()
        time = float(data["payload"]["time"])*60
        center = data["payload"]["center"]["coordinates"]
        lng = float(center[0])
        lat = float(center[1])
        print(jsonify(get_iso_parcel(lng, lat, time)))
    return json.loads(json.dumps(get_iso_parcel(lng, lat, time)))

@app.route('/get-area-filter', methods=["GET", "POST"])
def get_area_filter():
    
    if request.method=='POST':
        data = request.get_json()
        featureIds = data['featureIds']
        area_range = data['areaRange']
        grossFloorAreaRange = data['grossFloorAreaRange']
        print(grossFloorAreaRange)
        print(area_range)
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)
        #print(jsonify(area_filter(featureid)))
    return jsonify(
            area_filter(featureid,
            area_range[0],
            area_range[1],
            grossFloorAreaRange[0],
            grossFloorAreaRange[1] ))

@app.route('/get-buildings', methods=["GET", "POST"])
def get_building_inside_foi():
    if request.method=='POST':
        data = request.get_json()
        featureIds = data['foi']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)
        #print(featureid)
        #print(get_building(featureid))
    return get_building(featureid)

@app.route('/get-selected-feature-bound', methods=["GET", "POST"])
def get_feature_bbox():
    if request.method=='POST':
        data = request.get_json()
        featureGid = int(data['featureGid'])
    return get_selected_feature_bound(featureGid)


@app.route('/get-geocoded-points', methods=["GET", "POST"])
def get_geocode_points():
    if request.method=='GET':
        
        return get_geocoded_points()

@app.route('/get-proximity-analysis-result', methods=["GET", "POST"])
def get_proximity_analysis():
    if request.method=='POST':
        data = request.get_json()
        featureIds = data['foi']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)
        scores =[]
        data = proximity_analysis(featureid)
        for i in data['features']:
            scores.append(i['properties']['total_score'])
        #print(scores)
        print(mapclassify.Quantiles(scores, k=5))
        classes = mapclassify.Quantiles(scores , k=5).bins
        breaks = []
        for i in classes:
            breaks.append(i)
        lowerbound = min(scores)
    return {'data': data, 'lowerbound': lowerbound, 'breaks': breaks}

@app.route('/classify', methods=["GET", "POST"])
def classify():
    data = request.get_json()
    if data["selectedChoroplethMethod"] == "Univariate":
        featureIds = data['gids']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)
        if data['selectedLayer'] == "foi":
            data['selectedLayer'] = "parcel"
        jsonfile = classification(data['selectedLayer'], data['attribute1'], data['selectedLayer'], featureid)
        attColumn = jsonfile[0][0]['features']
        classificationMethod = data['selectedClassificationMethod']
        breaks = []
        classes = []
        if classificationMethod == "Quantiles":
            classes = mapclassify.Quantiles(attColumn, k=data['selectedClass']).bins
        elif classificationMethod == "NaturalBreaks":
            classes = mapclassify.NaturalBreaks(attColumn, k=data['selectedClass']).bins
        elif classificationMethod == "JenksCaspall":
            classes = mapclassify.JenksCaspall(attColumn, k=data['selectedClass']).bins
        elif classificationMethod == "EqualInterval":
            classes = mapclassify.EqualInterval(attColumn, k=data['selectedClass']).bins
            
        for i in classes:
            breaks.append(i)

        lowerbound = min(attColumn)
        print(classes)
        
        return {'layername': data['selectedLayer'], 'lowerbound': lowerbound, 'breaks': breaks, 'attribute':data['attribute1']}