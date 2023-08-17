import $i18n from '../../plugins/i18n/i18n'
const panel= {
    namespaced:true,
    getters:{
        getMenuItems(){
            const items = [
                { title: $i18n.t('panel.myAccount'), icon: 'mdi-account-outline', id:'user' },
                { title: $i18n.t('panel.layers'), icon: 'mdi-layers-outline', id:'layers' },
                { title: $i18n.t('panel.addData'), icon: 'mdi-plus', id:'addData' },
            ]
            return items
        },
        getMenuTools(){
            const tools = [
                { title: $i18n.t('panel.tools.lig'), icon: 'mdi-map-check', id:'ligfinder' },
                { title: $i18n.t('panel.tools.geo'), icon: 'mdi-nfc-search-variant', id:'geoparsing' },
                { title: $i18n.t('panel.tools.clsf'), icon: 'mdi-sort-descending', id:'classification' }
          ]
            return tools
        }
    }
}
export default panel