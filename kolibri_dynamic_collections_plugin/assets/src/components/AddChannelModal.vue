<template>

  <KModal
    :title="$tr('addChannelTitle')"
    :submitText="$tr('submitLabel')"
    :cancelText="coreString('cancelAction')"
    :submitDisabled="selectedChannels.length === 0"
    @submit="onModalSubmit"
    @cancel="$emit('cancel')"
  >
    <ul class="channels-list">
      <ChannelSelectListItem
        v-for="channel in channels.list"
        :key="channel.id"
        :channel="channel"
        :forceSelected="existingChannels.indexOf(channel.id) >= 0"
        @toggle="onChannelToggle"
      />
    </ul>
  </KModal>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import ChannelSelectListItem from './ChannelSelectListItem';

  export default {
    name: 'AddChannelModal',
    components: {
      ChannelSelectListItem,
    },
    mixins: [commonCoreStrings],
    props: {
      existingChannels: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        selectedChannels: [],
      };
    },
    computed: {
      ...mapState({
        channels: state => state.core.channels,
      }),
    },
    methods: {
      onModalSubmit() {
        this.$emit('submit', { channelIds: this.selectedChannels });
      },
      onChannelToggle({ channelId, selected }) {
        const index = this.selectedChannels.indexOf(channelId);
        if (selected && index < 0) {
          this.selectedChannels.push(channelId);
        } else if (!selected && index >= 0) {
          this.selectedChannels.splice(index, 1);
        }
      },
    },
    $trs: {
      addChannelTitle: {
        message: 'Add channels to collection',
        context: 'Title for the Add Channel modal dialog',
      },
      submitLabel: {
        message: 'Add channels',
        context: 'Label for the submit button',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  $channel-thumbnail-size: 32px;

  /* Magic number from
   * <https://github.com/learningequality/kolibri-design-system/blob/v1.4.1/lib/KModal.vue#L397-L400>
   */
  $modal-content-margin-h: 24px;

  ul.channels-list {
    padding: 0;
    margin: (0) (-$modal-content-margin-h);
    list-style: none;

    li {
      padding: 0 1em;
      margin: 0;
      border-bottom: solid $ui-input-border-width $ui-input-border-color;

      &:last-child {
        border-bottom-style: none;
      }
    }
  }

</style>
