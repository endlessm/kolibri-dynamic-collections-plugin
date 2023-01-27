<template>

  <tr>
    <td>
      <slot name="actions"></slot>
    </td>
    <td>
      <img
        v-if="thumbnailUrl"
        class="content-node-thumbnail"
        :src="thumbnailUrl"
      >
      <LearningActivityIcon
        v-else-if="isLeaf"
        class="content-node-thumbnail"
        :kind="learningActivities"
      />
      <KIcon
        v-else
        class="content-node-thumbnail"
        icon="topic"
        :color="$themePalette.grey.v_500"
      />
    </td>
    <td>
      <template v-if="!isLeaf">
        <KRouterLink
          appearance="basic-link"
          :text="title"
          :to="topicNodePage"
        />
      </template>
      <template v-else>
        <div class="content-node-title">
          {{ title }}
        </div>
        <div class="content-node-preview">
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
        </div>
      </template>
    </td>
    <td>{{ bytesText }}</td>
  </tr>

</template>


<script>

  import urls from 'kolibri.urls';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import bytesForHumans from 'kolibri.utils.bytesForHumans';
  import { PageNames } from '../constants';
  import LearningActivityIcon from './LearningActivityIcon';

  export default {
    name: 'CollectionContentNodeTableRow',
    components: {
      LearningActivityIcon,
    },
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
      title() {
        return this.contentNode.title;
      },
      learningActivities() {
        return this.contentNode.learning_activities;
      },
      thumbnailUrl() {
        return getContentNodeThumbnail(this.contentNode);
      },
      topicNodePage() {
        return {
          name: PageNames.COLLECTION_EDITOR_CHANNEL_TOPIC,
          params: { channelId: this.channelId, topicId: this.nodeId },
        };
      },
      previewUrl() {
        const urlFn = urls['kolibri:kolibri.plugins.learn:learn'];
        if (!urlFn) {
          return null;
        }
        return `${urlFn()}#/topics/c/${this.nodeId}`;
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
      bytesText() {
        return bytesForHumans(this.contentNode.total_file_size);
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


<style lang="scss" scoped>

  td {
    vertical-align: middle;
  }

  .content-node-thumbnail {
    width: auto;
    height: 2em;
    vertical-align: middle;
  }

  .content-node-preview {
    font-size: 0.85em;
    opacity: 0.9;
  }

</style>
