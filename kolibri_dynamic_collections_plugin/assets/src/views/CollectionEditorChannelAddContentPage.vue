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
        :disabledNodeIds="selectedNodeIds"
        @navigate="onContentNodeNavigate"
      >
        <template #nodeActions="{ contentNode, isDisabled }">
          <CollectionContentNodeCheckbox
            :contentNode="contentNode"
            :disabled="isDisabled"
            :isSelected="isNodeSelected(contentNode)"
            :isAncestorSelected="isNodeAncestorSelected(contentNode)"
            @toggle="onContentNodeCheckboxToggle"
          />
        </template>
      </CollectionContentNodeTable>

      <BottomAppBar>
        <span class="message">{{ selectionSummaryText }}</span>
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
      ...mapState('collectionChannel', ['channel']),
      ...mapState('channelBrowser', ['topic', 'children']),
      channelId() {
        return this.channel.id;
      },
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
        const size = Object.values(this.addContentNodes).reduce(
          (sum, node) => sum + node.total_file_size,
          0
        );
        return bytesForHumans(size);
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
      isNodeSelected(contentNode) {
        return (
          this.addNodeIds.indexOf(contentNode.id) >= 0 ||
          this.selectedNodeIds.indexOf(contentNode.id) >= 0
        );
      },
      isNodeAncestorSelected(contentNode) {
        return contentNode.ancestors.some(ancestorNode => this.isNodeSelected(ancestorNode));
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

  .message {
    display: inline-block;
    margin-right: 16px;
  }

</style>
