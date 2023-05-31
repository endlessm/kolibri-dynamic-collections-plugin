<template>

  <tr>
    <td>
      <KRouterLink
        v-if="channel"
        appearance="basic-link"
        class="channel-edit-button"
        icon="library"
        :text="channelName"
        :to="collectionChannelPage"
      />
      <KExternalLink
        v-else
        appearance="basic-link"
        class="channel-download-button"
        icon="download"
        :text="channelName"
        :title="$tr('importChannelButtonTooltip')"
        :href="channelImportUrl"
        :openInNewTab="true"
      />
    </td>
    <td>{{ $formatNumber(0) }}</td>
    <td>{{ bytesText }}</td>
    <td class="core-table-button-col">
      <slot name="actions"></slot>
    </td>
  </tr>

</template>


<script>

  import urls from 'kolibri.urls';
  import bytesForHumans from 'kolibri.utils.bytesForHumans';
  import { PageNames } from '../constants';

  export default {
    name: 'CollectionChannelTableRow',
    props: {
      channelId: {
        type: String,
        required: true,
      },
    },
    computed: {
      channel() {
        return this.$store.getters['getChannelObject'](this.channelId);
      },
      channelName() {
        if (this.channel) {
          return this.channel.title;
        } else {
          return this.$tr('unknownChannelTitle', { channelId: this.channelId });
        }
      },
      channelImportUrl() {
        // TODO: Instead of navigating to this page, we should run the
        //       importchannel task directly and show a progress bar.
        //       <https://phabricator.endlessm.com/T34353>
        const urlFn = urls['kolibri:kolibri.plugins.device:device_management'];
        if (!urlFn) {
          return null;
        }
        return `${urlFn()}#/content/channels/${this.channelId}`;
      },
      collectionChannelPage() {
        return {
          name: PageNames.COLLECTION_EDITOR_CHANNEL,
          params: { channelId: this.channelId },
        };
      },
      bytesText() {
        // TODO: Calculate the collection size in bytes.
        return bytesForHumans(0);
      },
    },
    $trs: {
      unknownChannelTitle: {
        message: '({channelId})',
        context: 'Placeholder title for an unknown channel',
      },
      importChannelButtonTooltip: {
        message: 'Import missing channel',
        context: 'Tooltip for a button to import missing content',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .core-table-button-col {
    width: 0;
  }

</style>
