<template>
  <span v-html="io" :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"></span>
</template>

<script>
export default {
  name: 'Stdout',

  props: {
    io: {
      type: String,
      default: ''
    },

    whiteTheme: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
  $background: #111;

  .dark-bg {
    background: $background;
  }

  .dark-font {
    color: #000;

    a {
      color: white;
    }
  }

  .white-bg {
    background: #ffffff;
  }

  .white-font {
    color: #ffffff;

    a {
      color: #ffffff;
    }
  }
</style>
