import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

function loadLocaleMessages() {
    const locales = require.context('.', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages= {}
    locales.keys().forEach(key => {
        const matched = key.match(/[A-za-z0-9-_]+/i);
        console.log("matched")
        console.log(matched)
        console.log(matched[0])
        if (matched && matched.length == 1) {
            const locale = matched[0];
            messages[locale] = locales(key)
        }
    });
    console.log("messages:")
    console.log(messages)
    return messages
}
//make supported locales list consumable by vue components
import supportedLocales from './supported-locales';
export function getSupportedLocales(){
    let annotatedLocales = []
    for (const code of Object.keys(supportedLocales)) {
      annotatedLocales.push({
        code,
        name: supportedLocales[code]
      })
    }
    return annotatedLocales
}

export default new VueI18n({
    locale: navigator.language.split('-')[0] || process.env.VUE_APP_I18N_LOCALE || 'en',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: loadLocaleMessages()
});
