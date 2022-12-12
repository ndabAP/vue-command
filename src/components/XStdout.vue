<template>
  <component class="vue-command__stdout" :is="component" />
</template>

<script lang="js">
export default {
  props: {
    component: {
      required: true,
      type: Object
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";
</style>
