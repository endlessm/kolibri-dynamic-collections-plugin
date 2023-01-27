<template>

  <KDropdownMenu
    appearance="raised-button"
    :options="dropdownOptions"
    :text="coreString('optionsLabel')"
    @select="onOptionsDropdownSelect"
  />

</template>


<script>

  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  const EXPORT_OPTION = 'EXPORT';
  const RESET_OPTION = 'RESET';

  export default {
    name: 'CollectionEditorOptionsMenu',
    mixins: [commonCoreStrings],
    computed: {
      dropdownOptions() {
        return [
          { label: this.$tr('exportButtonLabel'), value: EXPORT_OPTION },
          { label: this.$tr('resetButtonLabel'), value: RESET_OPTION },
        ];
      },
    },
    methods: {
      onOptionsDropdownSelect({ value }) {
        if (value === EXPORT_OPTION) {
          this.$emit('exportOptionSelect');
        } else if (value === RESET_OPTION) {
          this.$emit('resetOptionSelect');
        }
      },
    },
    $trs: {
      exportButtonLabel: {
        message: 'Export',
        context: 'Label for the Export button.',
      },
      resetButtonLabel: {
        message: 'Reset',
        context: 'Label for the Reset button.',
      },
    },
  };

</script>
