<template>

  <CoreTable class="collection-content-node-table">
    <template #headers>
      <th class="content-node-selected-column">
        <span class="visuallyhidden">
          {{ $tr('selectedHeader') }}
        </span>
        <slot name="nodeActions"></slot>
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
        <CollectionSelectionsTableRow
          v-for="contentNode in selectedNodesByLft"
          :key="contentNode.id"
          :contentNode="contentNode"
        >
          <template #actions>
            <slot name="nodeActions" v-bind="{ contentNode }"></slot>
          </template>
        </CollectionSelectionsTableRow>
      </tbody>
    </template>
  </CoreTable>

</template>


<script>

  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import CollectionSelectionsTableRow from './CollectionSelectionsTableRow';

  export default {
    name: 'CollectionSelectionsTable',
    components: {
      CollectionSelectionsTableRow,
      CoreTable,
    },
    props: {
      selectedNodes: {
        type: Array,
        required: true,
      },
    },
    computed: {
      selectedNodesByLft() {
        return this.selectedNodes.slice().sort((nodeA, nodeB) => nodeA.lft - nodeB.lft);
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

  .content-node-selected-column {
    width: 0;
  }

</style>
