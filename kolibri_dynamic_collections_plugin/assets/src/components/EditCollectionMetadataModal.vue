<template>

  <KModal
    :title="$tr('editMetadataTitle')"
    :submitText="$tr('submitLabel')"
    :cancelText="coreString('cancelAction')"
    :submitDisabled="!isValid"
    @submit="onModalSubmit"
    @cancel="$emit('cancel')"
  >
    <KTextbox
      ref="titleTextbox"
      v-model.trim="title"
      type="text"
      :label="$tr('titleLabel')"
      :autofocus="true"
      :maxlength="50"
    />

    <KTextbox
      ref="subtitleTextbox"
      v-model.trim="subtitle"
      type="text"
      :label="$tr('subtitleLabel')"
      :maxlength="50"
    />

    <KTextbox
      ref="descriptionTextbox"
      v-model.trim="description"
      type="text"
      :label="$tr('descriptionLabel')"
      :maxlength="50"
    />
  </KModal>

</template>


<script>

  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  export default {
    name: 'EditCollectionMetadataModal',
    mixins: [commonCoreStrings],
    props: {
      defaultMetadata: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        title: this.defaultMetadata.title,
        subtitle: this.defaultMetadata.subtitle,
        description: this.defaultMetadata.description,
      };
    },
    computed: {
      isValid() {
        return this.title && this.subtitle && this.description;
      },
    },
    methods: {
      onModalSubmit() {
        this.$emit('submit', {
          metadata: {
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
          },
        });
      },
    },
    $trs: {
      editMetadataTitle: {
        message: 'Edit collection metadata',
        context: 'Title for the Edit Collection Metadata modal dialog',
      },
      submitLabel: {
        message: 'Save',
        context: 'Label for the submit button',
      },
      titleLabel: {
        message: 'Title',
      },
      subtitleLabel: {
        message: 'Subtitle',
      },
      descriptionLabel: {
        message: 'Description',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  $channel-thumbnail-size: 32px;

  /* Magic number from
   * <https://github.com/learningequality/kolibri-design-system/blob/v1.4.1/lib/KModal.vue#L397-L400>
   */
  $modal-content-margin-h: 24px;

  ul.channels-list {
    padding: 0;
    margin: (0) (-$modal-content-margin-h);
    list-style: none;

    li {
      padding: 0 1em;
      margin: 0;
      border-bottom: solid $ui-input-border-width $ui-input-border-color;

      &:last-child {
        border-bottom-style: none;
      }
    }
  }

</style>
