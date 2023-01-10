<template>

  <li :class="channelCardClasses" @click="onChannelCardClick">
    <div class="channel-card-action">
      <KCheckbox
        ref="channelCheckbox"
        :label="$tr('channelCheckboxLabel')"
        :showLabel="false"
        :checked="isSelected"
        :disabled="isDisabled"
        @change="onChannelCheckboxChange"
      />
    </div>
    <div class="channel-card-thumbnail">
      <img
        v-if="channel.thumbnail"
        class="thumbnail"
        :src="channel.thumbnail"
      >
      <KIcon
        v-else
        icon="channel"
        class="thumbnail-svg"
        :style="{ backgroundColor: $themePalette.grey.v_200 }"
      />
    </div>
    <div class="channel-card-main">
      <div class="channel-title">{{ channel.title }}</div>
    </div>
  </li>

</template>


<script>

  export default {
    name: 'ChannelSelectListItem',
    props: {
      channel: {
        type: Object,
      },
      forceSelected: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isSelected: this.forceSelected,
      };
    },
    computed: {
      channelCardClasses() {
        const classes = ["channel-card"];
        if (this.isDisabled) {
          classes.push("channel-card-disabled");
        }
        return classes;
      },
      isDisabled() {
        return this.forceSelected;
      }
    },
    methods: {
      onChannelCardClick(event) {
        this.$refs.channelCheckbox.toggleCheck(event);
        event.stopPropagation();
      },
      onChannelCheckboxChange(selected, event) {
        this.$emit("toggle", { channelId: this.channel.id, selected });
        event.stopPropagation();
      },
    },
    $trs: {
      channelCheckboxLabel: {
        message: 'Select channel',
        context: 'Label for the checkbox to select a channel'
      },
    },
  };

</script>


<style lang="scss" scoped>

  $channel-thumbnail-size: 32px;

  .channel-card {
    display: flex;
    flex-direction: row;
    cursor: pointer;

    &.channel-card-disabled {
      cursor: default;
    }

    .channel-card-action {
      flex-grow: 0;
      margin: 0.5em 0;
      align-self: center;
    }

    .channel-card-thumbnail {
      flex-grow: 0;
      margin: 0.5em 1em;
      align-self: center;
    }

    .channel-card-main {
      flex-grow: 1;
      margin: 0.5em 0;
      align-self: center;
    }

    &.channel-card-disabled {
      .channel-card-thumbnail, .channel-card-main {
        opacity: 0.6;
      }
    }

    .thumbnail {
      display: block;
      width: auto;
      max-width: $channel-thumbnail-size;
      height: auto;
      max-height: $channel-thumbnail-size;
      object-fit: contain;
    }

    .thumbnail-svg {
      display: block;
      width: $channel-thumbnail-size;
      height: $channel-thumbnail-size;
    }
  }
</style>
