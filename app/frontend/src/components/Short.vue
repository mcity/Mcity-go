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
        <v-btn color="success" v-on:click="createURL">Make it smaller!</v-btn>
        {{reply}}
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      newUrl: {
        url: '',
        custom: ''
      },
      reply: '',
      wsURL: 'https://182p0czopi.execute-api.us-east-2.amazonaws.com/default/mcity-go',
      loading: false
    }
  },
  methods: {
    ...mapMutations('project', [
      'logError'
    ]),
    createURL: function () {
      this.loading = true;
      axios.post(this.wsURL, this.newUrl)
        .then((response)  =>  {
          this.loading = false;
          this.reply = "Your new URL is:" + response.data.value;
        })
        .catch(e => commit('logError', e, { root: true }))
    }
  }
}
</script>
<style>

</style>
