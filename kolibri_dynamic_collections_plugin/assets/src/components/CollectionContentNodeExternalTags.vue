<template>

  <div class="content-node-external-tags">
    <KCheckbox
      v-for="tagId in externalTagOptions"
      :key="tagId"
      :checked="tags.indexOf(tagId) >= 0"
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

  const EXTERNAL_TAGS = ['skill', 'career', 'highlight', 'curious'];

  export default {
    name: 'CollectionContentNodeExternalTags',
    components: {},
    mixins: [],
    props: {
      contentNode: {
        type: Object,
        required: true,
      },
      tags: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      externalTagOptions() {
        return EXTERNAL_TAGS;
      },
      nodeId() {
        return this.contentNode.id;
      },
    },
    methods: {
      onExternalTagCheckboxToggled(tagId, value) {
        const tagsSet = new Set(this.tags);
        if (value) {
          tagsSet.add(tagId);
        } else {
          tagsSet.delete(tagId);
        }
        this.$emit('change', {
          nodeId: this.nodeId,
          tags: Array.from(tagsSet),
        });
      },
    },
  };

</script>

<style lang="scss" scoped>

  .content-node-external-tags {
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
