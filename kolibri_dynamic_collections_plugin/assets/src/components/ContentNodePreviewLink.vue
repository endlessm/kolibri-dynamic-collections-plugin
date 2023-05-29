<template>

  <KExternalLink
    v-if="isAvailable"
    appearance="basic-link"
    :title="$tr('contentPreviewButtonTooltip')"
    :href="previewUrl"
    :openInNewTab="true"
  >
    {{ $tr('contentNodeAvailableLabel') }}
  </KExternalLink>
  <KExternalLink
    v-else
    appearance="basic-link"
    :title="$tr('contentInstallButtonTooltip')"
    :href="importUrl"
    :openInNewTab="true"
  >
    {{ $tr('contentNodeUnavailableLabel') }}
  </KExternalLink>

</template>


<script>

  import urls from 'kolibri.urls';

  export default {
    name: 'ContentNodePreviewLink',
    props: {
      contentNode: {
        type: Object,
        required: true,
      },
    },
    computed: {
      nodeId() {
        return this.contentNode.id;
      },
      topicId() {
        return this.contentNode.parent_id;
      },
      channelId() {
        return this.contentNode.channel_id;
      },
      isAvailable() {
        return this.contentNode.available;
      },
      isLeaf() {
        return this.contentNode.is_leaf;
      },
      previewUrl() {
        const urlFn = urls['kolibri:kolibri.plugins.learn:learn'];
        if (!urlFn) {
          return null;
        }
        if (this.isLeaf) {
          return `${urlFn()}#/topics/c/${this.nodeId}`;
        } else {
          return `${urlFn()}#/topics/t/${this.nodeId}`;
        }
      },
      importUrl() {
        // TODO: Instead of navigating to this page, we should run the
        //       importcontent task directly and show a progress bar.
        const urlFn = urls['kolibri:kolibri.plugins.device:device_management'];
        if (!urlFn) {
          return null;
        }
        return `${urlFn()}#/content/channels/${this.channelId}?node_id=${this.topicId}`;
      },
    },
    $trs: {
      contentNodeUnavailableLabel: {
        message: 'Not installed',
        context: 'Label indicating that a content node is not installed on this device',
      },
      contentNodeAvailableLabel: {
        message: 'View on this device',
        context: 'Label indicating that a content node can be viewed on this device',
      },
      contentPreviewButtonTooltip: {
        message: 'Display content',
        context: 'Tooltip for a button to view a content node in the Learn plugin',
      },
      contentInstallButtonTooltip: {
        message: 'Manage content',
        context: 'Tooltip for a button to add missing content in the Device plugin',
      },
    },
  };

</script>
