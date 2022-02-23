import Vue from 'vue';
import Vuex from 'vuex';
import userAuthentication from './modules/userAuthentication'
import map from './modules/map'
import mouseCoordinate from './modules/mouseCoordinate'
import database from './modules/database'
import layer from './modules/layer'
import layers from './modules/layers'
import tools from './modules/tools'
import ligfinder from './modules/ligfinder'
import administrativeAOI from './modules/administrativeAOI'
import geometryAOI from './modules/geometryAOI'
import results from './modules/results'
import AOI from './modules/AOI'
import isochroneAOI from './modules/isochroneAOI'
import area from './modules/area'
import geoparsing from './modules/geoparsing'
import proximity from './modules/proximity'
import classification from './modules/classification'
import legend from './modules/legend'
import criteria from './modules/criteria'
import building3D from './modules/building3D'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules:{
        userAuthentication,
        map,
        mouseCoordinate,
        database,
        layer,
        layers,
        tools,
        ligfinder,
        administrativeAOI,
        geometryAOI,
        results,
        AOI,
        isochroneAOI,
        area,
        geoparsing,
        proximity,
        classification,
        legend,
        criteria,
        building3D
    }

})

export default store;