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
            <KCheckbox
              :checked="isSelectAllChecked"
              :indeterminate="isSelectAllIndeterminate"
              @change="onSelectAllToggled"
            />
          </th>
          <th class="content-node-thumbnail-column">
            <span class="visuallyhidden">
              Thumbnail
            </span>
          </th>
          <th>Title</th>
          <th class="content-node-size-column">Size (MB)</th>
        </template>
        <template #tbody>
          <tbody>
            <tr v-for="node in children" :key="node.id">
              <td>
                <KCheckbox
                  :checked="false"
                  @change="onSelectAllToggled"
                />
              </td>
              <td>
                <img
                  v-if="node.thumbnail"
                  class="content-node-thumbnail"
                  :src="node.thumbnail"
                />
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
                  <span>{{ node.title }}</span>
                </template>
              </td>
              <td>{{ $formatNumber(bytesToMB(node.total_file_size)) }}</td>
            </tr>
          </tbody>
        </template>
      </CoreTable>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import { mapGetters, mapState } from 'vuex';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import dynamicCollectionsUtilsMixin from '../mixins/dynamicCollectionsUtilsMixin';
  import { PageNames } from '../constants';

  export default {
    name: 'CollectionEditorChannelPage',
    components: {
      CoreBase,
      CoreTable,
    },
    mixins: [commonCoreStrings, dynamicCollectionsUtilsMixin],
    computed: {
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
      isSelectAllChecked() {
        return false;
      },
      isSelectAllIndeterminate() {
        return false;
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
            text: this.topic.title
          }
        ];
        return result;
      }
    },
    methods: {
      getTopicRoute(channelId, topicId) {
        if (topicId && topicId !== channelId) {
          return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL_TOPIC, {channelId, topicId});
        } else {
          return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL, {channelId});
        }
      },
      onTopicLinkClicked(channelId, topicId) {
        this.$router.push(this.getTopicRoute(channelId, topicId));
      },
      onSelectAllToggled(value) {
        console.log("Select All toggled", value);
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

    th, td {
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

</style>
