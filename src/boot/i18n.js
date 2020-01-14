/* eslint-disable */
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

export default ({ app, Vue }) => {
  Vue.use(VueI18n)

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: localStorage.getItem('lang') || (navigator.language.toLowerCase()==='zh-cn'?'zh-cn':'en-us'),
    fallbackLocale: 'en-us',
    messages
  })

}
