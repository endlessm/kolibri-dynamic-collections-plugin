<template>

  <div class="editor-page-header">
    <div class="page-title">
      <h1>{{ title }}</h1>
      <slot name="subtitle"></slot>
    </div>
    <div class="page-actions">
      <slot name="actions"></slot>
    </div>
  </div>

</template>


<script>

  export default {
    name: 'EditorPageHeader',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .editor-page-header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 2em;
    margin-bottom: 1.6em;
  }

  .page-title {
    flex-basis: 50%;
    flex-grow: 1;

    h1 {
      margin-bottom: 0.2em;
    }
  }

  .page-actions {
    flex-shrink: 0;
    margin-top: 1.2em;
    text-align: right;
  }

</style>
