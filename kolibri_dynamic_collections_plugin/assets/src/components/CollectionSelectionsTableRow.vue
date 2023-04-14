<template>

  <tr>
    <td class="action-cell">
      <slot name="actions"></slot>
    </td>
    <td class="content-node-cell">
      <ContentNodeTile
        :contentNode="contentNode"
        :showBreadcrumbs="true"
      />
    </td>
    <td>{{ bytesText }}</td>
    <td class="core-table-button-col">
      <slot name="quickActions"></slot>
    </td>
  </tr>

</template>


<script>

  import bytesForHumans from 'kolibri.utils.bytesForHumans';
  import ContentNodeTile from './ContentNodeTile';

  export default {
    name: 'CollectionSelectionsTableRow',
    components: {
      ContentNodeTile,
    },
    props: {
      contentNode: {
        type: Object,
        required: true,
      },
    },
    computed: {
      bytesText() {
        return bytesForHumans(this.contentNode.total_file_size);
      },
    },
  };

</script>


<style lang="scss" scoped>

  td {
    vertical-align: middle;

    &.action-cell {
      width: 0;
    }
  }

  .core-table-button-col {
    width: 0;
  }

</style>
