<template>

  <KButton
    appearance="basic-link"
    :text="channelTitle"
    :disabled="!channelIsAvailable"
    icon="library"
    @click="onButtonClicked"
  />

</template>


<script>

  import { PageNames } from '../constants';

  export default {
    name: 'CollectionChannelLinkButton',
    components: {},
    mixins: [],
    props: {
      channelId: {
        type: String
      }
    },
    computed: {
      channelObject() {
        return this.$store.getters['getChannelObject'](this.channelId);
      },
      channelTitle() {
        if (!this.channelObject) {
          return this.$tr('unknownChannelTitle', {channelId: this.channelId});
        }
        return this.channelObject.title;
      },
      channelIsAvailable() {
        return Boolean(this.channelObject);
      },
    },
    methods: {
      onButtonClicked() {
        this.$router.push({
          name: PageNames.COLLECTION_EDITOR_CHANNEL,
          params: {channelId: this.channelId},
        });
      },
    },
    $trs: {
      unknownChannelTitle: {
        message: '({channelId})',
        context: 'Placeholder title for an unknown channel',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .collection-header {
    p {
      margin-bottom: 0;
    }
  }

  .collection-actions, .channels-table {
    /* 24px is a magic number used for ".move-down" in some Kolibri core plugins */
    margin-top: 24px;
  }

</style>
