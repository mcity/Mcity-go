<template>
  <v-container grid-list-md fluid>
    <v-layout wrap justify-start>
      <v-flex xs12 md12>
        <ul v-show="errors && errors.length">
          <li 
            v-for="(error, i) in errors" 
            :key="i"
          >
            {{error.message}}
          </li>
        </ul>
        <short class="mb-4"></short>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* This component serves as the homepage for the url shortening application */
import Short from './Short.vue'
export default {
  components: {
    Short
  },
  data () {
    return {
      errors: []
    }
  }
}
</script>
