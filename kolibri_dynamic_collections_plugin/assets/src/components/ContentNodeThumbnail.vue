<template>

  <img
    v-if="thumbnailUrl"
    :src="thumbnailUrl"
  >
  <LearningActivityIcon
    v-else-if="isLeaf"
    :kind="learningActivities"
  />
  <KIcon
    v-else
    icon="topic"
    :color="$themePalette.grey.v_500"
  />

</template>


<script>

  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import LearningActivityIcon from './LearningActivityIcon';

  export default {
    name: 'ContentNodeThumbnail',
    components: {
      LearningActivityIcon,
    },
    props: {
      contentNode: {
        type: Object,
        required: true,
      },
    },
    computed: {
      isLeaf() {
        return this.contentNode.is_leaf;
      },
      learningActivities() {
        return this.contentNode.learning_activities;
      },
      thumbnailUrl() {
        return getContentNodeThumbnail(this.contentNode);
      },
    },
  };

</script>
