<template>

  <tr>
    <td class="action-cell">
      <slot name="actions"></slot>
    </td>
    <td class="content-node-cell">
      <ContentNodeTile
        :contentNode="contentNode"
        :showPreviewLink="true"
      >
        <template v-if="!contentNode.is_leaf" #nodeTitle>
          <KButton
            appearance="basic-link"
            :text="contentNode.title"
            :style="{ 'font-weight': 'normal' }"
            @click="$emit('navigate')"
          />
        </template>
      </ContentNodeTile>
    </td>
    <td>{{ bytesText }}</td>
  </tr>

</template>


<script>

  import bytesForHumans from 'kolibri.utils.bytesForHumans';
  import ContentNodeTile from './ContentNodeTile';

  export default {
    name: 'CollectionContentNodeTableRow',
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
      padding-top: 16px;
      vertical-align: top;
    }
  }

</style>
