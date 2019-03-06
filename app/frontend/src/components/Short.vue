<template>
  <v-card>
    <v-card-title class="headline primary white--text">
      URL Shortener - go.um.city 
    </v-card-title>
    <v-card-text class="text-xs-left">
        <v-text-field
          v-model="newUrl.url"
          label="URL"
          :error-messages="urlFieldErrors($v.newUrl.url)"
          placeholder="http://mcity.umich.edu"
          @input="$v.newUrl.url.$touch()"
          @blur="$v.newUrl.url.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="newUrl.custom"
          label="Custom short name"
          placeholder="Leave Blank for random url"          
          :error-messages="textFieldOptionalErrors($v.newUrl.custom)"
          :hint="`${newUrl.custom.length}/8 Characters`"
          @input="$v.newUrl.custom.$touch()"
          @blur="$v.newUrl.custom.$touch()"
        ></v-text-field>
        <v-btn 
          @click="shrinkURL"
          :disabled="$v.newUrl.$invalid"
          color="primary">Shrink</v-btn>
        <a v-if="lastURL" :href="lastURL">{{lastURL}}</a>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { url, required, maxLength } from 'vuelidate/lib/validators'
import { validationMixin } from '../validators.js'
import api from '../api'

export default {
  mixins: [validationMixin],
  data () {
    return {
      newUrl: {
        url: '',
        custom: ''
      }
    }
  },
  methods: {
    ...mapActions('url/transactions', [
      'createURLAction'
    ]),
    shrinkURL: function () {
      this.createURLAction(this.newUrl)
    }
  },
  computed: {
    ...mapState('url', {
        lastURL: state => state.url.lastURL
    }),
    lastURL: {
      get () {
        return this.$store.state.url.lastURL
      }
    },
  },
  validations: {
    newUrl: {
      url: {
        required,
        url,
        maxLength: maxLength(600)
      },
      custom: {
        maxLength: maxLength(15)
      },
    }
  }
}
</script>
<style>

</style>
