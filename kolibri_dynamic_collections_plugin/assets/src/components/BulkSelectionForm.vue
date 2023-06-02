<template>

  <div>
    <div class="form-content">
      <ExternalTagsEditor
        class="external-tags-editor"
        :tags="tagsEditorTagIds"
        :indeterminateTags="tagsEditorIndeterminateTagIds"
        @add="onExternalTagsEditorAdd"
        @remove="onExternalTagsEditorRemove"
      />
    </div>
    <KButtonGroup>
      <KButton
        :text="$tr('resetButtonLabel')"
        :disabled="!hasChangedTags"
        @click="onResetButtonClick"
      />
      <KButton
        :text="$tr('applyButtonLabel')"
        :primary="true"
        :disabled="false"
        @click="onApplyButtonClick"
      />
    </KButtonGroup>
  </div>

</template>


<script>

  import pickBy from 'lodash/pickBy';
  import ExternalTagsEditor from '../components/ExternalTagsEditor';

  export default {
    name: 'BulkSelectionForm',
    components: {
      ExternalTagsEditor,
    },
    props: {
      defaultTags: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        changedTags: {},
      };
    },
    computed: {
      currentTags() {
        const result = Object.assign({}, this.defaultTags, this.changedTags);
        return result;
      },
      tagsEditorTagIds() {
        return Object.keys(pickBy(this.currentTags, value => value === true));
      },
      tagsEditorIndeterminateTagIds() {
        return Object.keys(pickBy(this.currentTags, value => value === null));
      },
      hasChangedTags() {
        return this.addTagIds.length > 0 || this.removeTagIds.length > 0;
      },
      addTagIds() {
        return Object.keys(pickBy(this.changedTags, value => value === true));
      },
      removeTagIds() {
        return Object.keys(pickBy(this.changedTags, value => value === false));
      },
    },
    methods: {
      reset() {
        this.changedTags = {};
      },
      onResetButtonClick() {
        this.reset();
      },
      onApplyButtonClick() {
        this.$emit('submit', {
          addTagIds: this.addTagIds,
          removeTagIds: this.removeTagIds,
        });
        this.reset();
      },
      onExternalTagsEditorAdd({ tagId }) {
        this.changedTags = Object.assign({}, this.changedTags, {
          [tagId]: true,
        });
      },
      onExternalTagsEditorRemove({ tagId }) {
        this.changedTags = Object.assign({}, this.changedTags, {
          [tagId]: false,
        });
      },
    },
    $trs: {
      applyButtonLabel: {
        message: 'Apply',
        context: 'Label for the bulk action Apply button.',
      },
      resetButtonLabel: {
        message: 'Reset',
        context: 'Label for the Reset button.',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  .form-content {
    float: left;
    margin: 0 16px;
  }

</style>
