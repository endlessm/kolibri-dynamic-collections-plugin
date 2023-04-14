<template>

  <CoreTable class="collection-content-node-table">
    <template #headers>
      <th class="content-node-selected-column">
        <span class="visuallyhidden">
          {{ $tr('selectedHeader') }}
        </span>
        <slot name="nodeActions" v-bind="buildContentNodeProps(topic)"></slot>
      </th>
      <th class="content-node-title-column">
        <span class="visuallyhidden">
          {{ $tr('titleHeader') }}
        </span>
      </th>
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
          :class="{ 'content-node-disabled': isNodeDisabled(contentNode) }"
          @navigate="$emit('navigate', { nodeId: contentNode.id })"
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
      disabledNodeIds: {
        type: Array,
        required: true,
      },
    },
    methods: {
      buildContentNodeProps(contentNode) {
        return {
          contentNode,
          isDisabled: this.isNodeDisabled(contentNode),
        };
      },
      isNodeDisabled(contentNode) {
        // TODO: Instead of doing this locally, update AllContentNodeViewset
        //       to accept a content manifest as request payload and annotate
        //       results to describe whether nodes are included.
        return this.disabledNodeIds.indexOf(contentNode.id) >= 0;
      },
    },
    $trs: {
      selectedHeader: {
        message: 'Selected',
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

  .content-node-disabled {
    opacity: 0.6;
  }

  .content-node-selected-column {
    width: 0;
  }

</style>
