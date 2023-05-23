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
          :class="{ 'content-node-faded': fadeNodeIds.includes(contentNode.id) }"
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
      fadeNodeIds: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      buildContentNodeProps(contentNode) {
        return {
          contentNode,
        };
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

  .content-node-faded {
    opacity: 0.6;
  }

  .content-node-selected-column {
    width: 0;
  }

</style>
