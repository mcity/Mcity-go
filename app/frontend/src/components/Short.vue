<template>
  <v-card>
    <v-card-title class="headline primary white--text">
      URL Shortener - go.um.city 
    </v-card-title>
    <v-card-text class="text-xs-left">
        <v-text-field
          v-model="newUrl.url"
          label="URL"
          placeholder="http://mcity.umich.edu"
        ></v-text-field>
        <v-text-field
          v-model="newUrl.custom"
          label="Custom short name"
          placeholder="Leave Blank for random url"
        ></v-text-field>
        <v-btn 
          @click="shrinkURL"
          color="primary">Shrink</v-btn>
        {{lastURL}}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import api from '../api'

export default {
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
  }
}
</script>
<style>

</style>
