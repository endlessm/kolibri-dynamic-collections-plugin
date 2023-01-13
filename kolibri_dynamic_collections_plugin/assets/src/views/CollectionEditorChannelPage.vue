<template>

  <CoreBase
    :immersivePage="true"
    :immersivePageRoute="immersivePageRoute"
    immersivePageIcon="close"
    :appBarTitle="$tr('collectionChannelAppBarTitle')"
    :toolbarTitle="$tr('collectionChannelAppBarTitle')"
    :showSubNav="false"
  >
    <KPageContainer>
      <div class="collection-channel-header">
        <h1>{{ $tr('collectionChannelHeader', { channelName }) }}</h1>
      </div>

      <KBreadcrumbs :items="breadcrumbItems" />

      <CoreTable class="collection-channel-content">
        <template #headers>
          <th class="content-node-selected-column">
            <span class="visuallyhidden">
              Selected
            </span>
            <CollectionContentNodeCheckbox
              :contentNode="topic"
              :selectedNodeIds="selectedNodeIds"
              @toggle="onCollectionContentNodeCheckboxToggled"
            />
          </th>
          <th class="content-node-thumbnail-column">
            <span class="visuallyhidden">
              Thumbnail
            </span>
          </th>
          <th>Title</th>
          <th class="content-node-size-column">
            Size
          </th>
        </template>
        <template #tbody>
          <tbody>
            <tr v-for="node in children" :key="node.id">
              <td>
                <CollectionContentNodeCheckbox
                  :contentNode="node"
                  :selectedNodeIds="selectedNodeIds"
                  @toggle="onCollectionContentNodeCheckboxToggled"
                />
              </td>
              <td>
                <img
                  v-if="node.thumbnail"
                  class="content-node-thumbnail"
                  :src="node.thumbnail"
                >
              </td>
              <td>
                <template v-if="node.kind === 'topic'">
                  <KButton
                    appearance="basic-link"
                    :text="node.title"
                    @click="onTopicLinkClicked(node.channel_id, node.id)"
                  />
                </template>
                <template v-else>
                  <div class="content-node-title">
                    {{ node.title }}
                  </div>
                  <div class="content-node-preview">
                    <KExternalLink
                      v-if="node.available"
                      appearance="basic-link"
                      :title="$tr('contentPreviewButtonTooltip')"
                      :href="previewUrl(node.id)"
                      :openInNewTab="true"
                    >
                      {{ $tr('contentNodeAvailableLabel') }}
                    </KExternalLink>
                    <KExternalLink
                      v-else
                      appearance="basic-link"
                      :title="$tr('contentInstallButtonTooltip')"
                      :href="importUrl(topic.id)"
                      :openInNewTab="true"
                    >
                      {{ $tr('contentNodeUnavailableLabel') }}
                    </KExternalLink>
                  </div>
                </template>
              </td>
              <td>{{ $formatNumber(bytesToMB(node.total_file_size)) }} MB</td>
            </tr>
          </tbody>
        </template>
      </CoreTable>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import { mapActions, mapGetters, mapState } from 'vuex';
  import urls from 'kolibri.urls';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import dynamicCollectionsUtilsMixin from '../mixins/dynamicCollectionsUtilsMixin';
  import { PageNames } from '../constants';
  import CollectionContentNodeCheckbox from '../components/CollectionContentNodeCheckbox';

  export default {
    name: 'CollectionEditorChannelPage',
    components: {
      CoreBase,
      CoreTable,
      CollectionContentNodeCheckbox,
    },
    mixins: [commonCoreStrings, dynamicCollectionsUtilsMixin],
    computed: {
      ...mapGetters('collectionChannel', ['selectedNodeIds']),
      ...mapState('collectionChannel', ['channel', 'topic', 'children']),
      channelId() {
        return this.$route.params.channelId;
      },
      channelName() {
        return this.channel.title;
      },
      immersivePageRoute() {
        return this.$router.getRoute(PageNames.COLLECTION_EDITOR_OVERVIEW);
      },
      breadcrumbItems() {
        if (!this.topic.ancestors) {
          return null;
        }
        const result = [
          ...this.topic.ancestors.map(node => ({
            text: node.title,
            link: this.getTopicRoute(this.channelId, node.id),
          })),
          {
            text: this.topic.title,
          },
        ];
        return result;
      },
    },
    methods: {
      ...mapActions('collectionBase', ['setNodeIncluded']),
      getTopicRoute(channelId, topicId) {
        if (topicId && topicId !== channelId) {
          return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL_TOPIC, {
            channelId,
            topicId,
          });
        } else {
          return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL, {
            channelId,
          });
        }
      },
      onTopicLinkClicked(channelId, topicId) {
        this.$router.push(this.getTopicRoute(channelId, topicId));
      },
      onCollectionContentNodeCheckboxToggled({ nodeId, included }) {
        this.setNodeIncluded({
          channelId: this.channelId,
          nodeId,
          included,
        });
      },
      previewUrl(nodeId) {
        const urlFn = urls['kolibri:kolibri.plugins.learn:learn'];
        if (!urlFn) {
          return null;
        }
        return `${urlFn()}#/topics/c/${nodeId}`;
      },
      importUrl(nodeId) {
        // TODO: Instead of navigating to this page, we should run the
        //       importcontent task directly and show a progress bar.
        const urlFn = urls['kolibri:kolibri.plugins.device:device_management'];
        if (!urlFn) {
          return null;
        }
        return `${urlFn()}#/content/channels/${this.channelId}?node_id=${nodeId}`;
      },
    },
    $trs: {
      collectionChannelAppBarTitle: {
        message: 'Manage Channel Selections',
        context: 'App bar title for the collections plugin channel editor',
      },
      collectionChannelHeader: {
        message: `Selections for '{channelName}'`,
        context: 'Title of the Collections Editor page.',
      },
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

  .collection-channel-header {
    p {
      margin-bottom: 0;
    }
  }

  .collection-channel-content {
    /* 24px is a magic number used for ".move-down" in some Kolibri core plugins */
    margin-top: 24px;

    th,
    td {
      vertical-align: middle;
    }
  }

  .content-node-selected-column,
  .content-node-thumbnail-column {
    width: 0;
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
