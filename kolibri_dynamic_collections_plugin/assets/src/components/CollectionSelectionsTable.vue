<template>

  <CoreTable class="collection-content-node-table">
    <template #headers>
      <th class="content-node-selected-column">
        <span class="visuallyhidden">
          {{ $tr('selectedHeader') }}
        </span>
        <slot name="nodeActions" v-bind="{ contentNode: null }"></slot>
      </th>
      <th class="content-node-title-column">
        <span class="visuallyhidden">
          {{ $tr('titleHeader') }}
        </span>
      </th>
      <th class="content-node-size-column">
        {{ $tr('sizeHeader') }}
      </th>
      <th class="content-node-action-column"></th>
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
          <template #details>
            <slot name="nodeDetails" v-bind="{ contentNode }"></slot>
          </template>
          <template #extraActions>
            <slot name="nodeExtraActions" v-bind="{ contentNode }"></slot>
          </template>
        </CollectionSelectionsTableRow>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" colspan="2">
            {{ $tr('totalHeader') }}
          </th>
          <td class="total-size-column">
            {{ totalSizeText }}
          </td>
        </tr>
      </tfoot>
    </template>
  </CoreTable>

</template>


<script>

  import bytesForHumans from 'kolibri.utils.bytesForHumans';
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
      selectedNodeIds() {
        return this.selectedNodes.map(contentNode => contentNode.id);
      },
      selectedNodesByLft() {
        return this.selectedNodes.slice().sort((nodeA, nodeB) => nodeA.lft - nodeB.lft);
      },
      totalSize() {
        return this.selectedNodes.reduce(
          (total, contentNode) =>
            this.doesNodeUseExtraSpace(contentNode) ? total : total + contentNode.total_file_size,
          0
        );
      },
      totalSizeText() {
        return bytesForHumans(this.totalSize);
      },
    },
    methods: {
      isNodeIdSelected(nodeId) {
        return this.selectedNodeIds.indexOf(nodeId) >= 0;
      },
      doesNodeUseExtraSpace(contentNode) {
        return contentNode.ancestors.some(ancestorNode => this.isNodeIdSelected(ancestorNode.id));
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
      totalHeader: {
        message: 'Total:',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  th {
    vertical-align: middle;
  }

  tfoot {
    border-top: dashed $ui-input-border-width $disabled-text-color;
  }

  .content-node-selected-column {
    width: 0;
  }

</style>
