from flask import Flask, request, jsonify, json, Response
import bcrypt
import base64
import mapclassify
from geopy.geocoders import Nominatim
from RestAPI import app
from .db import get_buildings, get_table_names, get_table, get_feature,get_selected_featuress,get_selected_feature,get_geom_aoi,get_iso_aoi,get_iso_parcel,area_filter,get_selected_feature_bound, get_geocoded_points, get_geocoded_newspaper_points, get_building, proximity_analysis, classification, bivariate_classification, bivariate_class_assignment, proximity_scoring, criterial_filter, validate_user, register_user, save_results_json, saved_user_results, delete_item_user_history, update_user_history_item_description, get_saved_parcels, get_word_cloud, get_word_cloud_parliament, get_liked_parcels, get_single_liked_parcel, spatial_union, get_union_features, spatial_intersection, get_geoparsing_date_filter, geoparsing_topic_filter, create_parcel_touch_test_table, analyze_parcel_touch_test_table, get_parcel_touch_test_table

@app.route('/', methods=["GET", "POST"])
def home():
    ggggid =2
    print(get_buildings(ggggid))
    return "welcome"

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
        center = data["payload"]["center"]
        lng = float(center["lng"])
        lat = float(center["lat"])
        mode = data["payload"]["mode"]
    return json.loads(json.dumps(get_iso_aoi(mode, lng, lat, time)))

@app.route('/get-aois', methods=["GET", "POST"])
def get_aois():
    
    data = request.get_json()
    nonEmptyData=[]
    for i in range(len(data["AOIs"])):
        if (data["AOIs"][i]["data"] is not None):
            nonEmptyData.append(i)
    
    print(nonEmptyData)
    
    adminLayer = None
    adminUnionLayer= None
    if data["AOIs"][0]["data"] is not None:
        featureid = []
        tablename= data["AOIs"][0]["data"][0]['table']
        for i in data["AOIs"][0]["data"]:
            featureid.append(int(i['id']))
        featureid= tuple(featureid)
        if(len(featureid)==1):

            adminLayer= get_feature(tablename, featureid[0] )
        else:
            adminUnionLayer= get_union_features(tablename, featureid )

    print(adminLayer, "adminLayer")
    print(adminUnionLayer, "adminLayer")


    if len(nonEmptyData)==3:
        if adminLayer is not None:
            union= spatial_union(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(data["AOIs"][2]["data"]["features"][0]["geometry"]))
            final_union = spatial_union(json.dumps(union["features"][0]["geometry"]), json.dumps(adminLayer["features"][0]["geometry"]))
            return jsonify(get_geom_aoi(json.dumps(final_union["features"][0]["geometry"])))
        elif adminUnionLayer is not None:
            union= spatial_union(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(data["AOIs"][2]["data"]["features"][0]["geometry"]))
            final_union = spatial_union(json.dumps(union["features"][0]["geometry"]), adminUnionLayer)
            return jsonify(get_geom_aoi(json.dumps(final_union["features"][0]["geometry"])))

    elif len(nonEmptyData)==2:
        if adminLayer is not None:
            union = spatial_union(json.dumps(adminLayer["features"][0]["geometry"]), json.dumps(data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            return jsonify(get_geom_aoi(json.dumps(union["features"][0]["geometry"])))
        elif adminUnionLayer is not None:
            union = spatial_union(adminUnionLayer, json.dumps(data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            return jsonify(get_geom_aoi(json.dumps(union["features"][0]["geometry"])))
        else:
            union= spatial_union(json.dumps(data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"]), json.dumps(data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            return jsonify(get_geom_aoi(json.dumps(union["features"][0]["geometry"])))
    elif len(nonEmptyData)==1:
        if adminLayer is not None:
           return jsonify(get_geom_aoi(json.dumps(adminLayer["features"][0]["geometry"])))
        elif adminUnionLayer is not None:
            return jsonify(get_geom_aoi(adminUnionLayer))
        else:
            return jsonify(get_geom_aoi(json.dumps(data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"])))

@app.route('/get-intersect_aois', methods=["GET", "POST"])
def get_intersect_aois():
    data = request.get_json()
    nonEmptyData=[]
    for i in range(len(data["AOIs"])):
        if (data["AOIs"][i]["data"] is not None):
            nonEmptyData.append(i)
    
    print(nonEmptyData)

    adminLayer = None
    adminUnionLayer= None
    if data["AOIs"][0]["data"] is not None:
        featureid = []
        tablename= data["AOIs"][0]["data"][0]['table']
        for i in data["AOIs"][0]["data"]:
            featureid.append(int(i['id']))
        featureid= tuple(featureid)
        if(len(featureid)==1):

            adminLayer= get_feature(tablename, featureid[0] )
        else:
            adminUnionLayer= get_union_features(tablename, featureid )

    if len(nonEmptyData)==1:
        if adminLayer is not None:
           return jsonify(get_geom_aoi(json.dumps(adminLayer["features"][0]["geometry"])))
        elif adminUnionLayer is not None:
            return jsonify(get_geom_aoi(adminUnionLayer))
        else:
            return jsonify(get_geom_aoi(json.dumps(data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"])))
    elif len(nonEmptyData)==2:
        if adminLayer is not None:

            intersection = spatial_intersection(json.dumps(adminLayer["features"][0]["geometry"]), json.dumps(data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            return jsonify(get_geom_aoi(json.dumps(intersection["features"][0]["geometry"])))
            
        elif adminUnionLayer is not None:
            intersection = spatial_intersection(adminUnionLayer, json.dumps(data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            return jsonify(get_geom_aoi(json.dumps(intersection["features"][0]["geometry"])))
        else:
            intersection= spatial_intersection(json.dumps(data["AOIs"][nonEmptyData[0]]["data"]["features"][0]["geometry"]), json.dumps(data["AOIs"][nonEmptyData[1]]["data"]["features"][0]["geometry"]))
            return jsonify(get_geom_aoi(json.dumps(intersection["features"][0]["geometry"])))

    if len(nonEmptyData)==3:
        if adminLayer is not None:
            intersection1= spatial_intersection(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(data["AOIs"][2]["data"]["features"][0]["geometry"]))
            intersection2 = spatial_intersection(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(adminLayer["features"][0]["geometry"]))
            intersection3 = spatial_intersection(json.dumps(data["AOIs"][2]["data"]["features"][0]["geometry"]), json.dumps(adminLayer["features"][0]["geometry"]))

            if len(intersection1['features'])!=0 and  len(intersection2['features'])!=0 and len(intersection3['features'])!=0:
                final_intersection = spatial_intersection(json.dumps(intersection1["features"][0]["geometry"]), json.dumps(adminLayer["features"][0]["geometry"]))
                return jsonify(get_geom_aoi(json.dumps(final_intersection["features"][0]["geometry"])))
            

        elif adminUnionLayer is not None:
            intersection1= spatial_intersection(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), json.dumps(data["AOIs"][2]["data"]["features"][0]["geometry"]))
            intersection2 = spatial_intersection(json.dumps(data["AOIs"][1]["data"]["features"][0]["geometry"]), adminUnionLayer)
            intersection3 = spatial_intersection(json.dumps(data["AOIs"][2]["data"]["features"][0]["geometry"]), adminUnionLayer)

            if len(intersection1['features'])!=0 and  len(intersection2['features'])!=0 and len(intersection3['features'])!=0:
                final_intersection = spatial_intersection(json.dumps(intersection1["features"][0]["geometry"]), adminUnionLayer)
                return jsonify(get_geom_aoi(json.dumps(final_intersection["features"][0]["geometry"])))
            


@app.route('/get-isochrone-parcel', methods=["GET", "POST"])
def get_isochrone_parcel():
    
    if request.method=='POST':
        data = request.get_json()
        time = float(data["payload"]["time"])*60
        center = data["payload"]["center"]
        lng = float(center["lng"])
        lat = float(center["lat"])
        mode = data["payload"]["mode"]
    return json.loads(json.dumps(get_iso_parcel(mode,lng, lat, time)))

@app.route('/get-area-filter', methods=["GET", "POST"])
def get_area_filter():
    
    if request.method=='POST':
        data = request.get_json()
        featureIds = data['featureIds']
        area_range = data['areaRange']
        grossFloorAreaRange = data['grossFloorAreaRange']
        unbuiltAreaRange = data['unbuiltAreaRange']
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
            grossFloorAreaRange[1],
            unbuiltAreaRange[0],
            unbuiltAreaRange[1] ))

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

@app.route('/get-geocoded-newspaper-points', methods=["GET", "POST"])
def get_geocode_newspaper_points():
    if request.method=='GET':
        
        return get_geocoded_newspaper_points()

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

@app.route('/get-proximity-scoring-result', methods=["GET", "POST"])
def get_proximity_score():
    if request.method=='POST':
        data = request.get_json()
        supermarketWeight = data['parameters'][0]['weight']
        metroWeight = data['parameters'][1]['weight']
        apothekeWeight = data['parameters'][2]['weight']
        krankenhausWeight=data['parameters'][3]['weight']
        kitaWeight = data['parameters'][4]['weight']
        featureIds = data['foi']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)
        scores =[]
        data = proximity_scoring(supermarketWeight, metroWeight, apothekeWeight,krankenhausWeight, kitaWeight, featureid)
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
        if data['selectedLayer'] == "foi" or data['selectedLayer'] == "results":
            data['selectedLayer'] = "parcel"
        jsonfile = classification(data['selectedLayer'], data['attribute1'], data['selectedLayer'], featureid)
        attColumn = jsonfile[0][0]['features']
        attColumn = [i for i in attColumn if i != None]
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
        return {'layername': data['selectedLayer'], 'lowerbound': lowerbound, 'breaks': breaks, 'attribute':data['attribute1']}

@app.route('/bivariate-classify', methods=["GET", "POST"])
def bivariate_classify():
    data = request.get_json()
    if data["selectedChoroplethMethod"] == "Bivariate":
        featureIds = data['gids']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)

        if data['selectedLayer'] == "foi":
            data['selectedLayer'] = "parcel"
        
        jsonfile = bivariate_classification(data['selectedLayer'], data['attribute1'], data['attribute2'], featureid)
        att1 = []
        att2 = []
        for f in jsonfile[0][0]["features"]:
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
        
       
        class_assignment = bivariate_class_assignment(data['attribute1'], data['attribute2'], breaks1[0], breaks1[1], breaks2[0], breaks2[1], featureid )
        #print(class_assignment)
        return class_assignment

@app.route('/set-criteria-filter', methods=["GET", "POST"])
def set_criteria_filter():
    data = request.get_json()
    excludeTags = data["excludeTags"]
    includeTags = data["includeTags"]
    operator = data["operator"]
    print(data)
    queryString = ""
    orquery = ""
    if (operator=="AND"):
        for i in includeTags:
            if i["filterType"] == "prozent":
                queryString += "and" + " " + i["columns"] + ">" + "0" + " "
            else:
                i["columns"] = i["columns"].split(',')
                for j in i["columns"]:
                    queryString += "and" + " " + j + "=" + "'"+ i["value"]+ "'" + " " 
        for i in excludeTags:
            if i["filterType"] == "prozent":
                queryString += "and" + " " + i["columns"] + " " "in" + " " + "(0, null)" + " "
            else:
                i["columns"] = i["columns"].split(',')
                for j in i["columns"]:
                    queryString += "and" + " " + j + " " + "is distinct from" + " " + "'" + i["value"] + "'" + " "
    elif (operator=="OR"):
        
        for i in includeTags:
            if i["filterType"] == "prozent":
                orquery += i["columns"] + ">" + "0" +  " " + "or" + " "
            else:
                i["columns"] = i["columns"].split(',')
                for j in i["columns"]:
                    orquery += j + " " + "in" + "(" + "'" + i["value"] + "'" + ")" + " " + "or" + " " 
        for i in excludeTags:
            if i["filterType"] == "prozent":
                queryString += "and" + " " + i["columns"] + " " "in" + " " + "(0, null)" + " "
            else:
                i["columns"] = i["columns"].split(',')
                for j in i["columns"]:
                    queryString += "and" + " " + j + " " + "is distinct from" + " " + "'" + i["value"] + "'" + " "
        
        if orquery:
            orquery = orquery[:-3]
            queryString += "and" + " " +"("+orquery+")"
    print(queryString)
    featureIds = data['featureIds']
    featureid = []
    for gid in featureIds:
        featureid.append(int(gid))
    featureid= tuple(featureid)

    print("excludeTags", excludeTags)
    print("includeTags", includeTags)
    print("operator", operator)
    return criterial_filter(featureid,queryString)

@app.route('/register-user', methods=["GET", "POST"])
def register():
    if request.method=='POST':
        data = request.get_json()
        firstname= data['payload']['firstName']
        lastName= data['payload']['lastName']
        email= data['payload']['email']
        password= data['payload']['password']
        password= password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password, salt)
        print(validate_user(email))
        if validate_user(email):
            return jsonify({'text':"User with this email address already exists", 'status': 'failure'})
            
        else:
            register_user(firstname, lastName, email, hashed.decode('ascii'))
            return jsonify({'text':"Your account has been successfully created", 'status': 'success'})
@app.route('/login-user', methods=["GET", "POST"])        
def login_user():
    if request.method=='POST':
        data = request.get_json()
        email= data['payload']['loginEmail']
        user_password= data['payload']['loginPassword']
        user_password= user_password.encode('utf-8')
        print(validate_user(email))
        if len(validate_user(email))>0:
            if bcrypt.checkpw(user_password, validate_user(email)[0][4].encode('ascii')):
                return jsonify({'text':"Your are successfully logged in ", 'status': 'success', 'id': validate_user(email)[0][0], 'firstname':validate_user(email)[0][1], 'lastname':validate_user(email)[0][2], 'email':validate_user(email)[0][3]})
            else:
                return jsonify({'text':"Incorrect email or password ", 'status': 'failure'})
        else:
            return jsonify({'text':"Incorrect email or password", 'status': 'failure'})

@app.route('/save-results', methods=["GET", "POST"])
def save_results():
    if request.method=='POST':
        data = request.get_json()
        save_results_json(json.dumps(data), data["userId"])
    return jsonify({'text': 'The results have been successfully saved!'})

@app.route('/delete-item-user-history', methods=["GET", "POST"])
def delete_item_from_user_history():
    if request.method=='POST':
        data = request.get_json()
        delete_item_user_history(data["id"], data["id"], data["id"], data["deleteItemName"])
    return "ok"

@app.route('/edit-item-user-history', methods=["GET", "POST"])
def edit_item_from_user_history():
    if request.method=='POST':
        data = request.get_json()
        print(data["payload"]["name"])
        desc = data["payload"]["description"]
        desc = f'"{desc}"'
        update_user_history_item_description(data["payload"]["name"], desc, data["payload"]["id"])
    return "ok"

@app.route('/get-saved-user-resultss', methods=["GET", "POST"])
def get_saved_user_results():
    if request.method=='POST':
        data = request.get_json()
        userId = data["id"]
    return jsonify(saved_user_results(userId))

@app.route('/get-saved-parcels', methods=["GET", "POST"])
def get_saved_parcel():
    if request.method=='POST':
        data = request.get_json()
        featureIds = data['gids']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)
    return get_saved_parcels(featureid)

@app.route('/get-word-frequency', methods=["GET", "POST"])
def get_word_cloudd():
    if request.method=='POST':
        data = request.get_json()
    return jsonify(get_word_cloud(data["date"]))

@app.route('/get-word-frequency-parliament', methods=["GET", "POST"])
def get_word_cloud_parliamentt():
    if request.method=='POST':
        data = request.get_json()
    return jsonify(get_word_cloud_parliament(data["docNum"]))

@app.route('/get-liked-parcels', methods=["GET", "POST"])
def get_liked_parcel():
    if request.method=='POST':
        data = request.get_json()
        featureIds = data['gids']
        featureid = []
        for gid in featureIds:
            featureid.append(int(gid))
        featureid= tuple(featureid)
        if(len(featureid)==1):
            return jsonify(get_single_liked_parcel(featureid[0]))
        else:
            return jsonify(get_liked_parcels(featureid))

@app.route('/geoparsing-date-filter', methods=["GET", "POST"])
def geoparsing_date_filter():
    if request.method=='POST':
        data = request.get_json()
        if data["datasetMode"]== 'parliament':
            return(get_geoparsing_date_filter('geocoded_address', 'date', data["dates"][0], data["dates"][1]))
        elif data["datasetMode"]== 'newspaper':
            return(get_geoparsing_date_filter('elbvertiefung', 'date', data["dates"][0], data["dates"][1]))

@app.route('/geocode-address', methods=["GET", "POST"])
def geocode_address():
    if request.method=='POST':
        data = request.get_json()
        geolocator = Nominatim(user_agent="ligfinder")
        location = geolocator.geocode(data["address"])
        if (location):

            return({"location": [location.longitude, location.latitude], "address": location.address, 'status': 'success'})
        else:
            return jsonify({'text':"No location found for the address", 'status': 'failure'})


@app.route('/geoparsing-topic-filter', methods=["GET", "POST"])
def topic_filter():
    if request.method=='POST':
        data = request.get_json()
        print(data)
        whereClause = ""
        
        for i in data["topics"]:
            if data["topicQueryMode"]=="AND":
                whereClause += 'and' + ' ' + '"'+ i + '"' + ' ' + "is" + ' '+ "true" + ' '
            elif data["topicQueryMode"]=="OR":
                whereClause += 'or' + ' ' + '"'+ i + '"' + ' ' + "is" + ' '+ "true" + ' '
            #print(data["topics"][i])
        query = whereClause.split()
        # remove first word and join the remaning words
        
        query = " ".join(query[1:])
        
        #print(geoparsing_topic_filter(query))
        return geoparsing_topic_filter(query)

@app.route('/get-touching-parcels', methods=["GET", "POST"])
def get_touching_parcels():
    if request.method=='POST':
        data = request.get_json()
        area_threshould = float(data['area'])
        
        #create_parcel_touch_test_table(tuple(data['gids']))
        #analyze_parcel_touch_test_table(area_threshould, area_threshould)
        #joined_parcel_data = get_parcel_touch_test_table(area_threshould)
        joined_parcel_data = analyze_parcel_touch_test_table(tuple(data['gids']), area_threshould, area_threshould, area_threshould)
        return joined_parcel_data