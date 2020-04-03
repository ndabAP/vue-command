<template>
  <component :is="component" />
</template>

<script>
export default {
  props: {
    component: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/mixins";
</style>
