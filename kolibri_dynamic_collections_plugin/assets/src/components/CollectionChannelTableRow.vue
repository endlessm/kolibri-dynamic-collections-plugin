<template>

  <tr>
    <td>
      <KRouterLink
        v-if="channel"
        appearance="basic-link"
        class="channel-edit-button"
        icon="library"
        :text="channel.title"
        :to="collectionChannelPage"
      />
      <KExternalLink
        v-else
        appearance="basic-link"
        class="channel-download-button"
        icon="download"
        :text="$tr('unknownChannelTitle', { channelId })"
        :title="$tr('importChannelButtonTooltip')"
        :href="channelImportUrl"
        :openInNewTab="true"
      />
    </td>
    <td>{{ $formatNumber(0) }}</td>
    <td>{{ $formatNumber(bytesToMB(0)) }} MB</td>
    <td class="core-table-button-col">
      <slot name="actions"></slot>
    </td>
  </tr>

</template>


<script>

  import urls from 'kolibri.urls';
  import { PageNames } from '../constants';
  import dynamicCollectionsUtilsMixin from '../mixins/dynamicCollectionsUtilsMixin';

  export default {
    name: 'CollectionChannelTableRow',
    mixins: [dynamicCollectionsUtilsMixin],
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
      channelImportUrl() {
        // TODO: Instead of navigating to this page, we should run the
        //       importchannel task directly and show a progress bar.
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
