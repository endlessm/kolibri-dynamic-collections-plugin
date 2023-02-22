<template>

  <CoreTable class="collection-content-node-table">
    <template #headers>
      <th class="content-node-selected-column">
        <span class="visuallyhidden">
          {{ $tr('selectedHeader') }}
        </span>
        <slot name="nodeActions" v-bind="buildContentNodeProps(topic)"></slot>
      </th>
      <th class="content-node-thumbnail-column">
        <span class="visuallyhidden">
          {{ $tr('thumbnailHeader') }}
        </span>
      </th>
      <th>{{ $tr('titleHeader') }}</th>
      <th class="content-node-size-column">
        {{ $tr('sizeHeader') }}
      </th>
    </template>
    <template #tbody>
      <tbody>
        <CollectionContentNodeTableRow
          v-for="contentNode in children"
          :key="contentNode.id"
          :contentNode="contentNode"
        >
          <template #actions>
            <slot name="nodeActions" v-bind="buildContentNodeProps(contentNode)"></slot>
          </template>
          <template #extraActions>
            <slot name="nodeExtraActions" v-bind="buildContentNodeProps(contentNode)"></slot>
          </template>
        </CollectionContentNodeTableRow>
      </tbody>
    </template>
  </CoreTable>

</template>


<script>

  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import CollectionContentNodeTableRow from './CollectionContentNodeTableRow';

  export default {
    name: 'CollectionContentNodeTable',
    components: {
      CoreTable,
      CollectionContentNodeTableRow,
    },
    props: {
      topic: {
        type: Object,
        required: true,
      },
      children: {
        type: Array,
        default: () => [],
      },
      selectedNodeIds: {
        type: Array,
        required: true,
      },
    },
    methods: {
      buildContentNodeProps(contentNode) {
        return {
          contentNode,
          isSelected: this.isNodeSelected(contentNode),
          isAncestorSelected: this.isNodeAncestorSelected(contentNode),
        };
      },
      isNodeSelected(contentNode) {
        // TODO: Instead of doing this locally, update AllContentNodeViewset
        //       to accept a content manifest as request payload and annotate
        //       results to describe whether nodes are included.
        return this.selectedNodeIds.indexOf(contentNode.id) >= 0;
      },
      isNodeAncestorSelected(contentNode) {
        return contentNode.ancestors.some(ancestorNode => this.isNodeSelected(ancestorNode));
      },
    },
    $trs: {
      selectedHeader: {
        message: 'Selected',
      },
      thumbnailHeader: {
        message: 'Thumbnail',
      },
      titleHeader: {
        message: 'Title',
      },
      sizeHeader: {
        message: 'Size',
      },
    },
  };

</script>


<style lang="scss" scoped>

  th {
    vertical-align: middle;
  }

  .content-node-selected-column,
  .content-node-thumbnail-column {
    width: 0;
  }

</style>
