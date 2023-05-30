<template>

  <div class="content-node-tile">
    <ContentNodeThumbnail
      :contentNode="contentNode"
      class="content-node-thumbnail"
    />
    <div class="content-node-main">
      <ol v-if="showBreadcrumbs" class="breadcrumbs-list">
        <li
          v-for="ancestor in contentNode.breadcrumbs"
          :key="ancestor.id"
        >
          {{ ancestor.title }}
        </li>
      </ol>
      <div v-if="contentNode.parent" class="node-title">
        <slot name="nodeTitle">
          {{ contentNode.title }}
        </slot>
      </div>
      <div v-else class="all-content-node-label">
        {{ $tr('allContentLabel') }}
      </div>
      <ContentNodePreviewLink
        v-if="(contentNode.is_leaf && showPreviewLink) || alwaysShowPreviewLink"
        :contentNode="contentNode"
        class="content-node-preview"
      />
      <slot name="details"></slot>
    </div>
  </div>

</template>


<script>

  import ContentNodePreviewLink from './ContentNodePreviewLink';
  import ContentNodeThumbnail from './ContentNodeThumbnail';

  export default {
    name: 'ContentNodeTile',
    components: {
      ContentNodePreviewLink,
      ContentNodeThumbnail,
    },
    props: {
      contentNode: {
        type: Object,
        required: true,
      },
      showBreadcrumbs: {
        type: Boolean,
        default: false,
      },
      alwaysShowPreviewLink: {
        type: Boolean,
        default: false,
      },
      showPreviewLink: {
        type: Boolean,
        default: true,
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

  .content-node-tile {
    display: flex;
    flex-direction: row;
    align-items: center;

    .content-node-thumbnail {
      flex-grow: 0;
      flex-shrink: 0;
      align-self: flex-start;
      width: auto;
      height: 2em;
      margin: 8px 16px 8px 0;
    }

    .content-node-main {
      flex-grow: 1;
    }
  }

  .breadcrumbs-list {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      display: inline-block;
      opacity: 0.6;

      &::after {
        margin: 0 8px 0 4px;
        content: '›';
      }

      &:last-child::after {
        display: none;
      }
    }
  }

  .node-title {
    font-weight: bold;
  }

  .all-content-node-label {
    font-style: italic;
  }

  .content-node-preview {
    font-size: 0.85em;
    opacity: 0.9;
  }

</style>
