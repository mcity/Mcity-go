<template>
  <v-container grid-list-md fluid>
    <v-layout wrap justify-start>
      <v-flex xs12 md12>
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
