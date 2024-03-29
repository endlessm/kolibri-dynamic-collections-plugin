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
          <KRouterLink
            appearance="basic-link"
            :appearanceOverrides="{ color: $themePalette.grey.v_700 }"
            :text="ancestor.title"
            :to="getAddMoreFromTopicPage(ancestor.id)"
          />
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
        v-if="contentNode.is_leaf && showPreviewLink"
        :contentNode="contentNode"
        class="content-node-preview"
      />
      <KRouterLink
        v-else-if="!contentNode.is_leaf && showChildrenLink"
        appearance="basic-link"
        class="content-node-children-label"
        :appearanceOverrides="{ color: $themePalette.grey.v_700 }"
        :text="topicChildrenText"
        :title="$tr('addMoreFromTopicTooltip')"
        :to="addMoreFromTopicPage"
      />
      <slot name="details"></slot>
    </div>
  </div>

</template>


<script>

  import { PageNames } from '../constants';
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
      showChildrenLink: {
        type: Boolean,
        default: false,
      },
      showPreviewLink: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      addMoreFromTopicPage() {
        return {
          name: PageNames.COLLECTION_EDITOR_CHANNEL_ADD_CONTENT,
          params: {
            channelId: this.contentNode.channel_id,
            topicId: this.contentNode.id,
          },
        };
      },
      topicChildrenText() {
        const count = this.contentNode.descendant_node_ids.length;
        return this.$tr('topicChildrenLabel', { count });
      },
    },
    methods: {
      getAddMoreFromTopicPage(topicId) {
        return {
          name: PageNames.COLLECTION_EDITOR_CHANNEL_ADD_CONTENT,
          params: {
            channelId: this.contentNode.channel_id,
            topicId: topicId,
          },
        };
      },
    },
    $trs: {
      allContentLabel: {
        message: 'All content',
        context: 'Label indicating this selects all content in the channel.',
      },
      topicChildrenLabel: {
        message:
          'Includes {count, number} {count, plural, one {content item} other {content items}}',
      },
      addMoreFromTopicTooltip: {
        message: 'Add More',
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
      margin: 0 16px 0 -4px;
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

      &::after {
        margin: 0 8px;
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

  .content-node-preview,
  .content-node-children-label {
    font-size: 0.85em;
    opacity: 0.9;
  }

</style>
