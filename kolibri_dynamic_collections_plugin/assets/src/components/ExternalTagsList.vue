<template>

  <div class="wrapper">
    <span class="tags-label">{{ $tr('tagsLabel') }}</span>
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
    <KDropdownMenu
      v-if="dropdownOptions.length > 0"
      appearance="raised-button"
      class="dropdown-menu-button"
      text="+"
      :options="dropdownOptions"
      :title="$tr('addTooltip')"
      @select="onOptionsDropdownSelect"
    />
  </div>

</template>


<script>

  import { EXTERNAL_TAGS } from '../constants';

  /* TODO: With Kolibri 0.16, use a KIconButton with a KDropdownMenu for the "Add" menu */

  export default {
    name: 'ExternalTagsList',
    props: {
      tags: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      dropdownOptions() {
        return EXTERNAL_TAGS.filter(tagId => !this.tags.includes(tagId)).map(tagId => ({
          label: tagId,
          value: tagId,
        }));
      },
    },
    methods: {
      onOptionsDropdownSelect({ value }) {
        this.$emit('add', { tagId: value });
      },
    },
    $trs: {
      addTooltip: {
        message: 'Add Tag',
      },
      removeTooltip: {
        message: 'Remove Tag',
      },
      tagsLabel: {
        message: 'Tags:',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  .wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin: -4px;
  }

  .tags-label {
    margin-right: 0.5em;
    margin-left: 6px;
  }

  .button {
    min-height: 0;
    padding: 2px 6px;
    margin: 4px;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.85em;
    font-weight: bold;
    line-height: 1.75em;
    text-transform: none;
    border: solid 1px $ui-input-border-width $ui-input-border-color;
    box-shadow: none;
  }

  .dropdown-menu-button {
    min-width: 2.5em;
    font-size: 1em;
    line-height: 1.4875em;

    &::v-deep .dropdown-arrow {
      display: none;
    }
  }

</style>
