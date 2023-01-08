<template>

  <KButton
    v-if="channelIsAvailable"
    appearance="basic-link"
    class="channel-edit-button"
    icon="library"
    :text="channelObject.title"
    @click="onLabelButtonClicked"
  />
  <KExternalLink
    v-else
    appearance="basic-link"
    class="channel-download-button"
    icon="download"
    :text="$tr('unknownChannelTitle', {channelId})"
    :title="$tr('importChannelButtonTooltip')"
    :href="importUrl"
    :openInNewTab="true"
  />

</template>


<script>

  import urls from 'kolibri.urls';
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
      importUrl() {
        // TODO: Instead of navigating to this page, we should run the
        //       importchannel task directly and show a progress bar.
        const urlFn = urls['kolibri:kolibri.plugins.device:device_management'];
        if (!urlFn) {
          return null;
        }
        return `${urlFn()}#/content/channels/${this.channelId}`;

      }
    },
    methods: {
      onLabelButtonClicked() {
        this.$router.push({
          name: PageNames.COLLECTION_EDITOR_CHANNEL,
          params: {channelId: this.channelId},
        });
      },
      onDownloadButtonClicked() {
        this.$router.push({

        });
      }
    },
    $trs: {
      unknownChannelTitle: {
        message: '({channelId})',
        context: 'Placeholder title for an unknown channel',
      },
      importChannelButtonTooltip: {
        message: 'Import missing channel',
        context: 'Tooltip for a button to import missing content'
      },
    },
  };

</script>


<style lang="scss" scoped>

</style>
