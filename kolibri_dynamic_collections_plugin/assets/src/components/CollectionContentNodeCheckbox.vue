<template>

  <KCheckbox
    :checked="isSelected"
    :indeterminate="isSelectedIndirectly"
    :class="{ 'selected-indirectly': isSelectedIndirectly }"
    :title="$tr('checkboxTooltip')"
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
      isSelected: {
        type: Boolean,
        default: false,
      },
      isAncestorSelected: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      nodeId() {
        return this.contentNode.id;
      },
      isSelectedIndirectly() {
        return this.isAncestorSelected && !this.isSelected;
      },
    },
    methods: {
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


<style lang="scss" scoped>

  .selected-indirectly {
    opacity: 0.5;
  }

</style>
