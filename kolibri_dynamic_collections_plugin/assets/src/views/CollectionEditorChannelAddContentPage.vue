<template>

  <CoreBase
    :immersivePage="true"
    :immersivePageRoute="immersivePageRoute"
    immersivePageIcon="back"
    :appBarTitle="$tr('addContentTitle')"
    :toolbarTitle="$tr('addContentTitle')"
    :showSubNav="false"
  >
    <KPageContainer>
      <KBreadcrumbs :items="breadcrumbItems" />

      <CollectionContentNodeTable
        class="collection-channel-content"
        :topic="topic"
        :children="children"
        :fadeNodeIds="selectedNodeIds"
        @navigate="onContentNodeNavigate"
      >
        <template #nodeActions="{ contentNode }">
          <CollectionContentNodeCheckbox
            :contentNode="contentNode"
            :disabled="nodeCheckboxIsDisabled(contentNode)"
            :isSelected="nodeCheckboxIsSelected(contentNode)"
            :isAncestorSelected="nodeCheckboxIsAncestorSelected(contentNode)"
            @toggle="onContentNodeCheckboxToggle"
          />
        </template>
      </CollectionContentNodeTable>

      <BottomAppBar>
        <div class="quick-tags-editor">
          <ExternalTagsEditor
            v-if="addNodeIds.length > 0"
            :tags="quickTags"
            @add="onQuickTagAdd"
            @remove="onQuickTagRemove"
          />
        </div>
        <span class="selected-items-text">{{ selectionSummaryText }}</span>
        <KButton
          :text="$tr('submitButtonLabel')"
          :primary="true"
          :disabled="addNodeIds.length === 0"
          @click="onSubmitButtonClick"
        />
      </BottomAppBar>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import union from 'lodash/union';
  import without from 'lodash/without';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import bytesForHumans from 'kolibri.utils.bytesForHumans';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import BottomAppBar from 'kolibri.coreVue.components.BottomAppBar';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import { PageNames } from '../constants';
  import CollectionContentNodeCheckbox from '../components/CollectionContentNodeCheckbox';
  import CollectionContentNodeTable from '../components/CollectionContentNodeTable';
  import ExternalTagsEditor from '../components/ExternalTagsEditor';

  export default {
    name: 'CollectionEditorChannelAddContentPage',
    components: {
      BottomAppBar,
      CollectionContentNodeCheckbox,
      CollectionContentNodeTable,
      CoreBase,
      ExternalTagsEditor,
    },
    mixins: [commonCoreStrings],
    data() {
      return {
        addContentNodes: {},
        quickTags: [],
      };
    },
    computed: {
      ...mapGetters('collectionChannel', ['selectedNodeIds']),
      ...mapState('collectionChannel', ['channelId']),
      ...mapState('channelBrowser', ['topic', 'children']),
      immersivePageRoute() {
        return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL, {
          channelId: this.channelId,
        });
      },
      breadcrumbItems() {
        if (!this.topic.ancestors) {
          return null;
        }
        const result = [
          ...this.topic.ancestors.map(node => ({
            text: node.title,
            link: this.getTopicRoute(node.id),
          })),
          {
            text: this.topic.title,
          },
        ];
        return result;
      },
      addNodeIds() {
        return Object.values(this.addContentNodes).map(contentNode => contentNode.id);
      },
      selectionSize() {
        return Object.values(this.addContentNodes).reduce(
          (total, contentNode) =>
            this.doesNodeUseExtraSpace(contentNode) ? total : total + contentNode.total_file_size,
          0
        );
      },
      selectionSizeText() {
        return bytesForHumans(this.selectionSize);
      },
      selectionSummaryText() {
        const count = this.addNodeIds.length;
        return this.$tr('selectionSummaryText', { count, size: this.selectionSizeText });
      },
    },
    methods: {
      ...mapActions('collectionBase', ['addSelectedNodes', 'setExternalTagsForNodes']),
      getTopicRoute(topicId) {
        const channelId = this.channelId;
        if (topicId && topicId !== channelId) {
          return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL_ADD_CONTENT, {
            channelId,
            topicId,
          });
        } else {
          return this.$router.getRoute(PageNames.COLLECTION_EDITOR_CHANNEL_ADD_CONTENT, {
            channelId,
            topicId: null,
          });
        }
      },
      onContentNodeNavigate({ nodeId }) {
        this.$router.push(this.getTopicRoute(nodeId));
      },
      onContentNodeCheckboxToggle({ contentNode, included }) {
        const addContentNodes = { ...this.addContentNodes };

        if (included) {
          addContentNodes[contentNode.id] = contentNode;
        } else {
          delete addContentNodes[contentNode.id];
        }

        this.addContentNodes = addContentNodes;
      },
      onQuickTagAdd({ tagId }) {
        this.quickTags = union(this.quickTags, [tagId]);
      },
      onQuickTagRemove({ tagId }) {
        this.quickTags = without(this.quickTags, tagId);
      },
      onSubmitButtonClick() {
        this.addSelectedNodes({
          channelId: this.channelId,
          nodeIds: this.addNodeIds,
        });
        if (this.quickTags.length > 0) {
          this.setExternalTagsForNodes({
            nodeIds: this.addNodeIds,
            tagIds: this.quickTags,
          });
        }
        this.$router.push(this.immersivePageRoute);
      },
      isNodeIdAlreadyAdded(nodeId) {
        return this.selectedNodeIds.indexOf(nodeId) >= 0;
      },
      isNodeIdAdded(nodeId) {
        return this.addNodeIds.indexOf(nodeId) >= 0;
      },
      doesNodeUseExtraSpace(contentNode) {
        return contentNode.ancestors.some(
          ancestorNode =>
            this.isNodeIdAlreadyAdded(ancestorNode.id) || this.isNodeIdAdded(ancestorNode.id)
        );
      },
      nodeCheckboxIsDisabled(contentNode) {
        return this.isNodeIdAlreadyAdded(contentNode.id);
      },
      nodeCheckboxIsSelected(contentNode) {
        return this.isNodeIdAlreadyAdded(contentNode.id) || this.isNodeIdAdded(contentNode.id);
      },
      nodeCheckboxIsAncestorSelected(contentNode) {
        return contentNode.ancestors.some(
          ancestorNode =>
            this.isNodeIdAlreadyAdded(ancestorNode.id) || this.isNodeIdAdded(ancestorNode.id)
        );
      },
    },
    $trs: {
      addContentTitle: {
        message: 'Add Content',
        context: 'Title for the Add Channel Content Metadata modal dialog',
      },
      submitButtonLabel: {
        message: 'Add Content',
        context: 'Label for the submit button',
      },
      selectionSummaryText: {
        message:
          '{count, number} {count, plural, one {item selected} other {items selected}} ({size})',
        context: 'Label identifying the number of items that are being added',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .quick-tags-editor {
    float: left;
    margin: 0 16px;
  }

  .selected-items-text {
    display: inline-block;
    margin-right: 16px;
  }

</style>
