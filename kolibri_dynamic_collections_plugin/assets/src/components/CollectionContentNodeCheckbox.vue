<template>

  <KCheckbox
    :checked="isSelected"
    :disabled="disabled"
    :indeterminate="isIndeterminate"
    :class="{ 'selected-indirectly': isSelectedIndirectly }"
    :title="$tr('checkboxTooltip')"
    :style="{ marginTop: 0, marginBottom: 0 }"
    @change="$emit('toggle', $event)"
  />

</template>


<script>

  export default {
    name: 'CollectionContentNodeCheckbox',
    components: {},
    mixins: [],
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      isSelected: {
        type: Boolean,
        default: false,
      },
      isDescendantSelected: {
        type: Boolean,
        default: false,
      },
      isAncestorSelected: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      isIndeterminate() {
        return !this.isSelected && (this.isDescendantSelected || this.isAncestorSelected);
      },
      isSelectedIndirectly() {
        return this.isIndeterminate && !this.isDescendantSelected;
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
