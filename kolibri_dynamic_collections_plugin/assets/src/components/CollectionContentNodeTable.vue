<template>

  <CoreTable class="collection-content-node-table">
    <template #headers>
      <th class="content-node-selected-column">
        <span class="visuallyhidden">
          {{ $tr('selectedHeader') }}
        </span>
        <slot name="nodeActions" :contentNode="topic"></slot>
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
            <slot name="nodeActions" :contentNode="contentNode"></slot>
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
