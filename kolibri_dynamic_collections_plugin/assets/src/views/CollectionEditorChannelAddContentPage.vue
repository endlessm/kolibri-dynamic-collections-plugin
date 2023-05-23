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
            :isDescendantSelected="nodeCheckboxIsDescendantSelected(contentNode)"
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
      selectionSizeText() {
        let totalSize = 0;

        for (const contentNode of Object.values(this.addContentNodes)) {
          if (!this.isNodeAncestorAdded(contentNode)) {
            totalSize += contentNode.total_file_size;
          }
        }

        return bytesForHumans(totalSize);
      },
      selectionSummaryText() {
        // TODO: Can we include a rough count here?
        //       Maybe break down number of topic and content nodes?
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
        const quickTags = new Set(this.quickTags);
        quickTags.add(tagId);
        this.quickTags = Array.from(quickTags);
      },
      onQuickTagRemove({ tagId }) {
        const quickTags = new Set(this.quickTags);
        quickTags.delete(tagId);
        this.quickTags = Array.from(quickTags);
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
      isNodeAncestorAdded(contentNode) {
        return contentNode.ancestors.some(ancestorNode => this.isNodeIdAdded(ancestorNode.id));
      },
      nodeCheckboxIsDisabled(contentNode) {
        return this.isNodeIdAlreadyAdded(contentNode.id);
      },
      nodeCheckboxIsSelected(contentNode) {
        return this.isNodeIdAlreadyAdded(contentNode.id) || this.isNodeIdAdded(contentNode.id);
      },
      nodeCheckboxIsDescendantSelected(contentNode) {
        return contentNode.descendant_node_ids.some(
          descendantNodeId =>
            this.isNodeIdAlreadyAdded(descendantNodeId) || this.isNodeIdAdded(descendantNodeId)
        );
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

  .hidden-items-message {
    margin: 1em 0 0.5em;

    p {
      margin: 0.5em 0;
    }
  }

  .quick-tags-editor {
    float: left;
    margin: 0 16px;
  }

  .selected-items-text {
    display: inline-block;
    margin-right: 16px;
  }

</style>
