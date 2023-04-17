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
        addNodeIds: [],
      };
    },
    computed: {
      ...mapGetters('collectionChannel', ['selectedNodeIds']),
      ...mapState('collectionChannel', ['topic', 'children']),
      channelId() {
        return this.$route.params.channelId;
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
      selectionSummaryText() {
        // TODO: Can we include a rough count here?
        //       Maybe break down number of topic and content nodes?
        const count = this.addNodeIds.length;
        return this.$tr('selectionSummaryText', { count });
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
      onContentNodeCheckboxToggle({ nodeId, included }) {
        if (included) {
          this.addNodeIds = union(this.addNodeIds, [nodeId]);
        } else {
          this.addNodeIds = without(this.addNodeIds, nodeId);
        }
      },
      onSubmitButtonClick() {
        this.addSelectedNodes({
          channelId: this.channelId,
          nodeIds: this.addNodeIds,
        });
        this.$router.push(this.immersivePageRoute);
      },
      isNodeIdAlreadyAdded(nodeId) {
        return this.selectedNodeIds.indexOf(nodeId) >= 0;
      },
      isNodeIdAdded(nodeId) {
        return this.addNodeIds.indexOf(nodeId) >= 0;
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
        message: '{count, number} {count, plural, one {node selected} other {nodes selected}}',
        context: 'Label identifying the number of nodes that are being added',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .selected-items-text {
    display: inline-block;
    margin-right: 16px;
  }

</style>
