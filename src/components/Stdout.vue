<template>
  <component :is="component" />
</template>

<script>
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
