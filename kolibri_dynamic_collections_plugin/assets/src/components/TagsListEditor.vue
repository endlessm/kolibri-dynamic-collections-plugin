<template>

  <div class="external-tags-list">
    <span class="tags-label">{{ $tr('tagsLabel') }}</span>
    <span v-if="tags.length === 0" class="no-tags-label">{{ $tr('noTagsLabel') }}</span>
    <KButton
      v-for="tagId in tags"
      v-else
      :key="tagId"
      class="tag-button"
      appearance="flat-button"
      :text="tagId"
      :title="$tr('removeTooltip')"
      @click="$emit('remove', { tagId })"
    />
    <KDropdownMenu
      v-if="dropdownOptions.length > 0"
      appearance="flat-button"
      class="add-tag-button"
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
      noTagsLabel: {
        message: '(No tags)',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  .external-tags-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .tags-label {
    margin: 0 0.5em 0 0;
  }

  .no-tags-label {
    margin: 0 0.5em;
    font-size: 0.85em;
    color: $secondary-text-color;
  }

  .button {
    min-width: 2em;
    min-height: 0;
    padding: 2px 6px;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.85em;
    font-weight: bold;
    line-height: 1.75em;
    text-transform: none !important;
    border: 0;
    box-shadow: none;
  }

  .add-tag-button {
    font-size: 1em;
    line-height: 1.4875em;

    &::v-deep .dropdown-arrow {
      display: none;
    }
  }

</style>
