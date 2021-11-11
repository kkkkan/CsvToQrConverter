import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

const opts = {
    theme: {
      themes: {
        light: {
          primary: colors.yellow.lighten4
        }
      }
    }
  }

export default new Vuetify(opts);
