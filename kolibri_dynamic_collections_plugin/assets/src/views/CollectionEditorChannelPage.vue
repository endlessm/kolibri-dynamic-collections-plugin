<template>

  <CoreBase
    :immersivePage="true"
    :immersivePageRoute="immersivePageRoute"
    immersivePageIcon="close"
    :appBarTitle="$tr('collectionChannelAppBarTitle')"
    :toolbarTitle="$tr('collectionChannelAppBarTitle')"
    :showSubNav="false"
  >
    <KPageContainer>
      <div class="collection-channel-header">
        <h1>{{ $tr('collectionChannelHeader', { channelName }) }}</h1>
      </div>

      <div class="collection-channel-browser">
        <p>Channel browser goes here</p>
      </div>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { PageNames } from '../constants';

  export default {
    name: 'CollectionEditorChannelPage',
    components: {
      CoreBase,
    },
    mixins: [commonCoreStrings],
    computed: {
      channelName() {
        return this.channel.title;
      },
      immersivePageRoute() {
        return this.$router.getRoute(PageNames.COLLECTION_EDITOR_OVERVIEW);
      },
    },
    methods: {},
    $trs: {
      collectionChannelAppBarTitle: {
        message: 'Manage Channel Selections',
        context: 'App bar title for the collections plugin channel editor',
      },
      collectionChannelHeader: {
        message: `Selections for '{channelName}'`,
        context: 'Title of the Collections Editor page.',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .collection-channel-header {
    p {
      margin-bottom: 0;
    }
  }

  .collection-channel-browser {
    /* 24px is a magic number used for ".move-down" in some Kolibri core plugins */
    margin-top: 24px;
  }

</style>
