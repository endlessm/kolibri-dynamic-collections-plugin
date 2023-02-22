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

      <CollectionContentNodeTable
        class="collection-channel-content"
        :topic="topic"
        :children="children"
      >
        <template #nodeActions="{ contentNode }">
          <CollectionContentNodeCheckbox
            :contentNode="contentNode"
            :selectedNodeIds="selectedNodeIds"
            @toggle="onCollectionContentNodeCheckboxToggled"
          />
        </template>
        <template #nodeExtraActions="{ contentNode, isAncestorSelected, isSelected }">
          <CollectionContentNodeExternalTags
            v-if="isSelected || isAncestorSelected"
            :contentNode="contentNode"
            @change="onCollectionContentNodeExternalTagsChange"
          />
        </template>
      </CollectionContentNodeTable>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import { mapActions, mapGetters, mapState } from 'vuex';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import { PageNames } from '../constants';
  import CollectionContentNodeCheckbox from '../components/CollectionContentNodeCheckbox';
  import CollectionContentNodeExternalTags from '../components/CollectionContentNodeExternalTags';
  import CollectionContentNodeTable from '../components/CollectionContentNodeTable';

  export default {
    name: 'CollectionEditorChannelPage',
    components: {
      CoreBase,
      CollectionContentNodeCheckbox,
      CollectionContentNodeExternalTags,
      CollectionContentNodeTable,
    },
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
      onCollectionContentNodeCheckboxToggled({ nodeId, included }) {
        this.setNodeIncluded({
          channelId: this.channelId,
          nodeId,
          included,
        });
      },
      onCollectionContentNodeExternalTagsChange({ nodeId, tags }) {
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
  }

</style>
