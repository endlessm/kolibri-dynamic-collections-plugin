<template>

  <CoreTable class="collection-content-node-table">
    <template #headers>
      <th class="content-node-selected-column">
        <span class="visuallyhidden">
          {{ $tr('selectedHeader') }}
        </span>
        <slot name="nodeActions"></slot>
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
        <tr v-for="nodeId in selectedNodeIds" :key="nodeId">
          <td><slot name="nodeActions"></slot></td>
          <td>?</td>
          <td>{{ nodeId }}</td>
          <td>0</td>
        </tr>
      </tbody>
    </template>
  </CoreTable>

</template>


<script>

  import CoreTable from 'kolibri.coreVue.components.CoreTable';

  export default {
    name: 'CollectionSelectionsTable',
    components: {
      CoreTable,
    },
    props: {
      selectedNodeIds: {
        type: Array,
        required: true,
      },
    },
    methods: {},
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
