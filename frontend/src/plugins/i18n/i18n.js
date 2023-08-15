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

export default new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages()
});
