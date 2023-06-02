<template>

  <div class="editor-section-header">
    <div class="section-title">
      <h2>{{ title }}</h2>
    </div>
    <div class="section-actions">
      <slot name="actions"></slot>
    </div>
  </div>

</template>


<script>

  export default {
    name: 'EditorSectionHeader',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .editor-section-header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 0.5em;
    column-gap: 2em;
    align-items: flex-end;
    margin: 1em 0;
  }

  .section-title {
    flex-basis: 50%;
    flex-grow: 1;

    h2 {
      margin: 0;
    }
  }

  .section-actions {
    flex-shrink: 0;
    margin-top: 0.5em;
    text-align: right;
  }

</style>
