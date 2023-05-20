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

      <CollectionSelectionsTable
        v-if="selectedNodes.length > 0"
        class="collection-channel-content"
        :selectedNodes="selectedNodes"
      >
        <template #nodeActions="{ contentNode }">
          <KCheckbox
            v-if="contentNode"
            :checked="bulkEditNodeIds.includes(contentNode.id)"
            :title="$tr('nodeCheckboxTooltip')"
            :style="{ marginTop: 0, marginBottom: 0 }"
            @change="onNodeCheckboxChange($event, { contentNode })"
          />
          <KCheckbox
            v-else
            :checked="isEveryNodeChecked"
            :indeterminate="bulkEditNodeIds.length > 0 && !isEveryNodeChecked"
            :title="$tr('allNodesCheckboxTooltip')"
            :style="{ marginTop: 0, marginBottom: 0 }"
            @change="onAllNodesCheckboxChange"
          />
        </template>
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

      <BottomAppBar v-if="bulkEditNodeIds.length > 0">
        <BulkSelectionForm
          :defaultTags="bulkSelectionEditorDefaultTags"
          @submit="onBulkSelectionFormSubmit"
        />
      </BottomAppBar>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import intersection from 'lodash/intersection';
  import union from 'lodash/union';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import BottomAppBar from 'kolibri.coreVue.components.BottomAppBar';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import { PageNames } from '../constants';
  import BulkSelectionForm from '../components/BulkSelectionForm';
  import ExternalTagsList from '../components/ExternalTagsList';
  import CollectionSelectionsTable from '../components/CollectionSelectionsTable';
  import EditorPageHeader from '../components/EditorPageHeader';

  export default {
    name: 'CollectionEditorChannelPage',
    components: {
      BottomAppBar,
      CoreBase,
      BulkSelectionForm,
      ExternalTagsList,
      CollectionSelectionsTable,
      EditorPageHeader,
    },
    data() {
      return {
        bulkEditNodeIds: [],
      };
    },
    computed: {
      ...mapState('collectionBase', ['externalTagsByNode']),
      ...mapState('collectionChannel', ['channelId']),
      ...mapGetters('collectionChannel', ['selectedNodes']),
      channel() {
        return this.$store.getters['getChannelObject'](this.channelId) || {};
      },
      channelName() {
        return this.channel.title;
      },
      selectedNodeIds() {
        return this.selectedNodes.map(contentNode => contentNode.id);
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
      isEveryNodeChecked() {
        return this.selectedNodes.every(contentNode =>
          this.bulkEditNodeIds.includes(contentNode.id)
        );
      },
      bulkSelectionEditorDefaultTags() {
        const tagsByNodeId = this.bulkEditNodeIds.map(nodeId => this.externalTagsByNode[nodeId]);
        const tagsForAnyNode = union(...tagsByNodeId.values());
        const tagsForAllNodes = intersection(...tagsByNodeId.values());
        const result = Object.fromEntries(
          tagsForAnyNode.map(tagId => [tagId, tagsForAllNodes.includes(tagId) ? true : null])
        );
        return result;
      },
    },
    methods: {
      ...mapActions('collectionBase', ['removeSelectedNode', 'changeExternalTagsForNodes']),
      reset() {
        this.bulkEditNodeIds = [];
      },
      addBulkEditNode(contentNode) {
        const bulkEditNodeIds = new Set(this.bulkEditNodeIds);
        bulkEditNodeIds.add(contentNode.id);
        this.bulkEditNodeIds = Array.from(bulkEditNodeIds);
      },
      removeBulkEditNode(contentNode) {
        const bulkEditNodeIds = new Set(this.bulkEditNodeIds);
        bulkEditNodeIds.delete(contentNode.id);
        this.bulkEditNodeIds = Array.from(bulkEditNodeIds);
      },
      onBulkSelectionFormSubmit({ addTagIds, removeTagIds }) {
        this.changeExternalTagsForNodes({
          nodeIds: this.bulkEditNodeIds,
          addTagIds,
          removeTagIds,
        });
        this.reset();
      },
      onAllNodesCheckboxChange(checked) {
        if (checked) {
          this.bulkEditNodeIds = [...this.selectedNodeIds];
        } else {
          this.bulkEditNodeIds = [];
        }
      },
      onNodeCheckboxChange(checked, { contentNode }) {
        if (checked) {
          this.addBulkEditNode(contentNode);
        } else {
          this.removeBulkEditNode(contentNode);
        }
      },
      onNodeRemoveButtonClick({ contentNode }) {
        this.removeBulkEditNode(contentNode);
        this.removeSelectedNode({ channelId: this.channelId, nodeId: contentNode.id });
      },
      onExternalTagsListAdd(nodeId, { tagId }) {
        this.changeExternalTagsForNodes({ nodeIds: [nodeId], addTagIds: [tagId] });
      },
      onExternalTagsListRemove(nodeId, { tagId }) {
        this.changeExternalTagsForNodes({ nodeIds: [nodeId], removeTagIds: [tagId] });
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
      allNodesCheckboxTooltip: {
        message: 'Select All',
        context: 'Tooltip for the All Nodes checkbox, used for bulk editing.',
      },
      nodeCheckboxTooltip: {
        message: 'Select',
        context: 'Tooltip for the content node checkbox, used for bulk editing.',
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

  .collection-channel-empty {
    font-size: 0.85em;
    border-top: solid $ui-input-border-width $ui-input-border-color;
  }

  .node-details {
    margin-top: 8px;
  }

</style>
