<template>

  <div class="external-tags-editor">
    <KCheckbox
      v-for="tagId in externalTagOptions"
      :key="tagId"
      :checked="tags.includes(tagId)"
      :indeterminate="indeterminateTags.includes(tagId)"
      :label="tagId"
      @change="onExternalTagCheckboxToggled(tagId, $event)"
    />
  </div>

</template>


<script>

  // For now, we hard code a list of external tags that are useful with
  // Endless Key's Kolibri Explore Plugin.
  // TODO: Use a tags input with typeahead, similar to
  //       <https://bootstrap-tagsinput.github.io/bootstrap-tagsinput/examples/>

  const EXTERNAL_TAGS = ['career', 'curious', 'highlight', 'skill'];

  export default {
    name: 'ExternalTagsEditor',
    components: {},
    mixins: [],
    props: {
      tags: {
        type: Array,
        default: () => [],
      },
      indeterminateTags: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      externalTagOptions() {
        return EXTERNAL_TAGS;
      },
    },
    methods: {
      onExternalTagCheckboxToggled(tagId, value) {
        if (value) {
          this.$emit('add', { tagId });
        } else {
          this.$emit('remove', { tagId });
        }
      },
    },
  };

</script>

<style lang="scss" scoped>

  .external-tags-editor {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0.5em -0.5em -0.25em;

    .k-checkbox-container {
      margin: 0 0.5em;
      font-size: 0.85em;

      &::v-deep .k-checkbox-label {
        padding-left: 6px;
        font-family: 'Source Code Pro', monospace;
        font-weight: bold;
      }
    }
  }

</style>
