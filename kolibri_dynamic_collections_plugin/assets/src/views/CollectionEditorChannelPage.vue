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
      <EditorPageHeader :title="$tr('collectionChannelHeader', { channelName })">
        <template #actions>
          <KButtonGroup>
            <KButton
              :text="$tr('addContentButtonLabel')"
              :primary="true"
              :style="{ marginLeft: 0 }"
              @click="$router.push(addContentRoute)"
            />
          </KButtonGroup>
        </template>
      </EditorPageHeader>

      <!-- <div class="collection-channel-header">
        <h1>{{ $tr('collectionChannelHeader', { channelName }) }}</h1>
      </div> -->

      <CollectionSelectionsTable
        v-if="selectedNodes.length > 0"
        class="collection-channel-content"
        :selectedNodes="selectedNodes"
      >
        <template #nodeDetails="{ contentNode }">
          <div class="node-details">
            <ExternalTagsList
              :tags="externalTagsByNode[contentNode.id]"
              @remove="onExternalTagsListRemove(contentNode.id, $event)"
            />
          </div>
        </template>
        <template #nodeExtraActions="{ contentNode }">
          <KIconButton
            appearance="flat-button"
            icon="remove"
            :title="$tr('nodeRemoveButtonTooltip')"
            @click="onNodeRemoveButtonClick({ contentNode })"
          />
        </template>
      </CollectionSelectionsTable>
      <div v-else class="collection-channel-empty">
        <p>
          {{ $tr('emptyChannelLabel') }}
        </p>
      </div>

    </KPageContainer>
  </CoreBase>

</template>


<script>

  import { mapActions, mapGetters, mapState } from 'vuex';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import { PageNames } from '../constants';
  import ExternalTagsList from '../components/ExternalTagsList';
  import CollectionSelectionsTable from '../components/CollectionSelectionsTable';
  import EditorPageHeader from '../components/EditorPageHeader';

  export default {
    name: 'CollectionEditorChannelPage',
    components: {
      CoreBase,
      ExternalTagsList,
      CollectionSelectionsTable,
      EditorPageHeader,
    },
    computed: {
      ...mapState('collectionChannel', ['channelId']),
      ...mapGetters('collectionChannel', ['selectedNodes']),
      channel() {
        return this.$store.getters['getChannelObject'](this.channelId) || {};
      },
      channelName() {
        return this.channel.title;
      },
      immersivePageRoute() {
        return this.$router.getRoute(PageNames.COLLECTION_EDITOR_OVERVIEW);
      },
      addContentRoute() {
        return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL_ADD_CONTENT, {
          channelId: this.channelId,
          topicId: null,
        });
      },
    },
    methods: {
      ...mapActions('collectionBase', ['removeSelectedNode', 'removeExternalTagForNodes']),
      onNodeRemoveButtonClick({ contentNode }) {
        this.removeSelectedNode({ channelId: this.channelId, nodeId: contentNode.id });
      },
      onExternalTagsListRemove(nodeId, { tagId }) {
        this.removeExternalTagForNodes( { nodeIds: [nodeId], tagId })
      },
    },
    $trs: {
      addContentButtonLabel: {
        message: 'Add Content',
        context: 'Label for the Add Content button.',
      },
      collectionChannelAppBarTitle: {
        message: 'Manage Channel',
        context: 'App bar title for the collections plugin channel editor',
      },
      collectionChannelHeader: {
        message: `{channelName}`,
        context: 'Title of the Collections Editor page.',
      },
      emptyChannelLabel: {
        message: 'No content selected.',
        context: 'Placeholder message when there is no content selected for a channel.',
      },
      nodeRemoveButtonTooltip: {
        message: 'Remove Content',
        context: 'Tooltip for the Remove Content icon button.',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  .collection-channel-header {
    p {
      margin-bottom: 0;
    }
  }

  .collection-channel-empty {
    font-size: 0.85em;
    border-top: solid $ui-input-border-width $ui-input-border-color;
  }

  .node-details {
    margin-top: 8px;
  }

</style>
