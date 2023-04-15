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
        v-if="isTopicVisible && visibleChildren.length > 0"
        class="collection-channel-content"
        :topic="topic"
        :children="visibleChildren"
        @navigate="onContentNodeNavigate"
      >
        <template #nodeActions="{ contentNode, isDisabled }">
          <CollectionContentNodeCheckbox
            :contentNode="contentNode"
            :disabled="isDisabled"
            :isSelected="isNodeAdded(contentNode)"
            :isDescendantSelected="isNodeDescendantAdded(contentNode)"
            :isAncestorSelected="isNodeAncestorAdded(contentNode)"
            @toggle="onContentNodeCheckboxToggle"
          />
        </template>
      </CollectionContentNodeTable>

      <div v-if="hiddenChildrenCount > 0" class="hidden-items-message">
        <p v-if="isTopicVisible">
          {{ $tr('hiddenItemsMessage', { count: hiddenChildrenCount }) }}
        </p>
        <p v-else-if="topic.parent">
          {{ $tr('hiddenTopicMessage') }}
        </p>
        <p v-else>
          {{ $tr('hiddenChannelMessage') }}
        </p>
        <div v-if="visibleChildren.length === 0 && isTopicVisible">
          <CollectionContentNodeCheckbox
            :contentNode="topic"
            :label="$tr('addTopicCheckboxLabel')"
            :isSelected="isNodeAdded(topic)"
            :isDescendantSelected="isNodeDescendantAdded(topic)"
            :isAncestorSelected="isNodeAncestorAdded(topic)"
            @toggle="onContentNodeCheckboxToggle"
          />
        </div>
      </div>

      <BottomAppBar>
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

  export default {
    name: 'CollectionEditorChannelAddContentPage',
    components: {
      BottomAppBar,
      CollectionContentNodeCheckbox,
      CollectionContentNodeTable,
      CoreBase,
    },
    mixins: [commonCoreStrings],
    data() {
      return {
        addContentNodes: {},
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
      isTopicVisible() {
        return !this.isNodeHidden(this.topic);
      },
      visibleChildren() {
        return this.children.filter(contentNode => !this.isNodeHidden(contentNode));
      },
      hiddenChildrenCount() {
        return this.children.length - this.visibleChildren.length;
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
      ...mapActions('collectionBase', ['addSelectedNodes']),
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
      onSubmitButtonClick() {
        this.addSelectedNodes({
          channelId: this.channelId,
          nodeIds: this.addNodeIds,
        });
        this.$router.push(this.immersivePageRoute);
      },
      isNodeIdHidden(nodeId) {
        return this.selectedNodeIds.indexOf(nodeId) >= 0;
      },
      isNodeHidden(contentNode) {
        return (
          this.isNodeIdHidden(contentNode.id) ||
          contentNode.ancestors.some(ancestorNode => this.isNodeIdHidden(ancestorNode.id))
        );
      },
      isNodeIdAdded(nodeId) {
        return this.addNodeIds.indexOf(nodeId) >= 0;
      },
      isNodeAdded(contentNode) {
        return this.isNodeIdAdded(contentNode.id);
      },
      isNodeDescendantAdded(contentNode) {
        return contentNode.descendant_node_ids.some(descendantNodeId =>
          this.isNodeIdAdded(descendantNodeId)
        );
      },
      isNodeAncestorAdded(contentNode) {
        return contentNode.ancestors.some(ancestorNode => this.isNodeIdAdded(ancestorNode.id));
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
      hiddenItemsMessage: {
        message:
          '{count, number} {count, plural, one {item from this topic has} other {items from this topic have}} already been added to the collection.',
        context:
          'Label identifying the number of items that have been hidden from view because they were already added',
      },
      hiddenTopicMessage: {
        message: 'All items from this topic have already been added to the collection.',
        context: 'Label indicating that all items from this topic have already been added',
      },
      hiddenChannelMessage: {
        message: 'All items from this channel have already been added to the collection.',
        context: 'Label indicating that all items from this channel have already been added',
      },
      addTopicCheckboxLabel: {
        message: 'Add this entire topic instead?',
        context:
          'Label for a checkbox that offers to add an entire topic node if all its children have been added',
      },
      selectionSummaryText: {
        message:
          '{count, number} {count, plural, one {item selected} other {items selected}} (~{size})',
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

  .selected-items-text {
    display: inline-block;
    margin-right: 16px;
  }

</style>
