<template>

  <div class="wrapper">
    <KButton
      v-for="tagId in tags"
      :key="tagId"
      class="tag-button"
      appearance="raised-button"
      icon="bookmark"
      :text="tagId"
      :title="$tr('removeTooltip')"
      @click="$emit('remove', { tagId })"
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
    $trs: {
      removeTooltip: {
        message: 'Remove Tag',
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
    margin: 6px;
    padding: 4px;
    font-size: 0.85em;
    font-weight: bold;
    font-family: 'Source Code Pro', monospace;
    line-height: 1.75em;
    min-height: 0;
    text-transform: none;
  }

</style>
