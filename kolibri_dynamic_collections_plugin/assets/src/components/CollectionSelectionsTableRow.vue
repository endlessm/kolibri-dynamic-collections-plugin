<template>

  <tr>
    <td class="action-cell">
      <slot name="actions"></slot>
    </td>
    <td class="thumbnail-cell">
      <ContentNodeThumbnail
        :contentNode="contentNode"
        class="content-node-thumbnail"
      />
    </td>
    <td class="title-cell">
      <ol class="node-breadcrumbs-list">
        <li
          v-for="ancestor in contentNode.ancestors.slice(1)"
          :key="ancestor.id"
          class="simple-breadcrumb-ancestor"
        >
          {{ ancestor.title }}
        </li>
      </ol>
      <div v-if="contentNode.parent" class="node-title">
        {{ contentNode.title }}
      </div>
      <div v-else class="all-content-node-title">
        {{ $tr('allContentLabel') }}
      </div>
    </td>
    <td>{{ bytesText }}</td>
  </tr>

</template>


<script>

  import bytesForHumans from 'kolibri.utils.bytesForHumans';
  import ContentNodeThumbnail from './ContentNodeThumbnail';

  export default {
    name: 'CollectionSelectionsTableRow',
    components: {
      ContentNodeThumbnail,
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
    $trs: {
      allContentLabel: {
        message: 'All content',
        context: 'Label indicating this selects all content in the channel.',
      },
    },
  };

</script>


<style lang="scss" scoped>

  td {
    vertical-align: middle;

    &.action-cell {
      padding-top: 20px;
    }

    &.thumbnail-cell {
      padding: 16px 8px;
    }
  }

  .node-title {
    font-weight: bold;
  }

  .all-content-node-title {
    margin: 0.25em 0;
    font-style: italic;
  }

  .node-breadcrumbs-list {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      display: inline-block;

      &::after {
        margin: 0 8px 0 4px;
        content: '›';
      }

      &:last-child::after {
        display: none;
      }
    }

    li.simple-breadcrumb-ancestor {
      opacity: 0.6;
    }
  }

  .content-node-thumbnail {
    width: auto;
    height: 2em;
  }

</style>
