<template>

  <div class="external-tags-editor">
    <span class="label">Tags:</span>
    <KCheckbox
      v-for="tagId in allTagIds"
      :key="tagId"
      :checked="tags.includes(tagId)"
      :indeterminate="indeterminateTags.includes(tagId)"
      :label="tagId"
      @change="onExternalTagCheckboxToggled(tagId, $event)"
    />
  </div>

</template>


<script>

  import {NODE_EXTERNAL_TAGS} from '../constants';

  export default {
    name: 'TagsCheckboxEditor',
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
      allTagIds() {
        return [...NODE_EXTERNAL_TAGS];
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

    .label {
      margin: 0 0.5em;
    }

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
