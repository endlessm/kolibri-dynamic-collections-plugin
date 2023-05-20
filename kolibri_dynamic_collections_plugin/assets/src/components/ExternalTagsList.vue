<template>

  <div class="wrapper">
    <KButton
      v-for="tagId in tags"
      :key="tagId"
      class="tag-button"
      appearance="raised-button"
      icon="bookmark"
      :text="tagId"
    />
  </div>

</template>


<script>

  export default {
    name: 'ExternalTagsList',
    props: {
      tags: {
        type: Array,
        default: () => [],
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  .wrapper {
    margin: -6px;
  }

  .tag-button {
    min-height: 0;
    padding: 4px;
    margin: 6px;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.85em;
    font-weight: bold;
    line-height: 1.75em;
    text-transform: none;
  }

</style>
