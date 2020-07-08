// import something here
import _util from 'src/util'
import { Notify } from 'quasar'

// leave the export, even if you don't use it
export default ({ Vue }) => {
  // something to do
  // Vue.use(Toasted)
  // // toast
  window.toast = function (msg) {
    Notify.create({
      message: msg,
      position: "center",
      timeout: 2000,
      color: "secondary"
    })
  }

  Vue.prototype.util = _util
}
