<template>

  <KCheckbox
    :checked="isNodeToggled"
    :indeterminate="isNodeIndeterminate"
    :title="$tr('checkboxTooltip')"
    :disabled="!isNodeEnabled"
    :style="{ marginTop: 0, marginBottom: 0 }"
    @change="onNodeCheckboxToggled"
  />

</template>


<script>

  export default {
    name: 'CollectionContentNodeCheckbox',
    components: {},
    mixins: [],
    props: {
      contentNode: {
        type: Object,
        required: true,
      },
      selectedNodeIds: {
        type: Array,
        required: true,
      },
    },
    computed: {
      nodeId() {
        return this.contentNode.id;
      },
      ancestorNodeIds() {
        return this.contentNode.ancestors.map(node => node.id);
      },
      isNodeToggled() {
        // TODO: Instead of doing this locally, update AllContentNodeViewset
        //       to accept a content manifest as request payload and annotate
        //       results to describe whether nodes are included.
        if (this.selectedNodeIds === undefined) {
          return true;
        }
        return this.getNodeEnabled(this.nodeId) || this.ancestorNodeIds.some(this.getNodeEnabled);
      },
      isNodeIndeterminate() {
        // TODO: If children are selected but not this node, it should appear
        //       as indeterminate.
        return false;
      },
      isNodeEnabled() {
        // TODO: If parent node is included, this node is marked as toggled,
        //       and also disabled. Parent must be explicitly deselected
        //       first.
        return !this.ancestorNodeIds.some(this.getNodeEnabled);
      },
    },
    methods: {
      getNodeEnabled(nodeId) {
        return this.selectedNodeIds.indexOf(nodeId) >= 0;
      },
      onNodeCheckboxToggled(value) {
        this.$emit('toggle', {
          nodeId: this.nodeId,
          included: value,
        });
      },
    },
    $trs: {
      checkboxTooltip: {
        message: 'Select content',
        context: 'Tooltip for the content selection checkbox',
      },
    },
  };

</script>
