<template>

  <CoreBase
    :appBarTitle="$tr('collectionAppBarTitle')"
    :toolbarTitle="$tr('collectionAppBarTitle')"
    :immersivePage="false"
    :showSubNav="false"
  >
    <KPageContainer>
      <KGrid>
        <KGridItem class="collection-header" :layout8="{ span: 4 }" :layout12="{ span: 6 }">
          <h1>{{ $tr('editorHeader') }}</h1>
          <p>
            {{ collectionName }}
            <KButton
              appearance="basic-link"
              icon="edit"
              :title="$tr('renameButtonLabel')"
              :ariaLabel="$tr('renameButtonLabel')"
            />
          </p>
        </KGridItem>
        <KGridItem class="collection-actions" :layout="{ alignment: 'right' }" :layout8="{ span: 4 }" :layout12="{ span: 6 }">
          <KButtonGroup>
            <KDropdownMenu
              appearance="raised-button"
              :options="dropdownOptions"
              @select="onOptionsDropdownSelected"
              :text="coreString('optionsLabel')"
            />
            <KButton
              :text="$tr('addChannelButtonLabel')"
              :primary="true"
              :style="{ marginLeft: 0 }"
              @click="onAddChannelClicked"
            />
          </KButtonGroup>
        </KGridItem>
      </KGrid>

      <CoreTable class="channels-table">
        <template #headers>
          <th>Channel</th>
          <th>Items</th>
          <th>Size</th>
          <th>
            <span class="visuallyhidden">
              {{ coreString('userActionsColumnHeader') }}
            </span>
          </th>
        </template>
        <template #tbody>
          <tbody>
            <tr v-for="channelSelections in channelSelectionsList" :key="channelSelections.id">
              <td>
                <CollectionChannelLinkButton
                  :channelId="channelSelections.id"
                  @click="onEditClicked(channelSelections.id)"
                />
              </td>
              <td>{{ $formatNumber(channelSelections.nodesCount) }}</td>
              <td>{{ $formatNumber(bytesToMB(channelSelections.size)) }} MB</td>
              <td class="core-table-button-col">
                <KButton
                  appearance="flat-button"
                  :text="$tr('removeButtonLabel')"
                  @click="onRemoveClicked(channelSelections.id)"
                />
              </td>
            </tr>
          </tbody>
        </template>
      </CoreTable>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import { mapActions, mapGetters, mapState } from 'vuex';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import dynamicCollectionsUtilsMixin from '../mixins/dynamicCollectionsUtilsMixin';
  import CollectionChannelLinkButton from '../components/CollectionChannelLinkButton';

  const EXPORT_OPTION = 'EXPORT';
  const RESET_OPTION = 'RESET';

  export default {
    name: 'CollectionEditorPage',
    components: {
      CoreBase,
      CoreTable,
      CollectionChannelLinkButton,
    },
    mixins: [commonCoreStrings, dynamicCollectionsUtilsMixin],
    computed: {
      ...mapGetters('collectionBase', ['channelSelectionsList']),
      ...mapState('collectionBase', ['collectionEditorData']),
      collectionName() {
        const metadata = this.collectionEditorData.metadata;
        return `${metadata.description} - ${metadata.subtitle} - ${metadata.title}`;
      },
      dropdownOptions() {
        return [
          { label: this.$tr('exportButtonLabel'), value: EXPORT_OPTION },
          { label: this.$tr('resetButtonLabel'), value: RESET_OPTION },
        ];
      },
    },
    methods: {
      ...mapActions('collectionBase', ['removeChannel']),
      onAddChannelClicked() {
        console.log("AddChannel button clicked");
      },
      onRemoveClicked(channelId) {
        this.removeChannel({channelId});
      },
      onOptionsDropdownSelected({ value }) {
        if (value === EXPORT_OPTION) {
          console.log("Export button clicked");
        } else if (value === RESET_OPTION) {
          console.log("Reset button clicked");
        }
      },
      getChannelTitle(channelId) {
        const channel = this.$store.getters['getChannelObject'](channelId);
        return channel ? channel.title : undefined;
      },
    },
    $trs: {
      addChannelButtonLabel: {
        message: 'Add Channel',
        context: 'Label for the Add Channel button.',
      },
      collectionAppBarTitle: {
        message: 'Dynamic Collections',
        context: 'App bar title for the collections plugin',
      },
      editorHeader: {
        message: 'Collection',
        context: 'Title of the Collections Editor page.',
      },
      editButtonLabel: {
        message: 'Edit',
        context: 'Label for the Edit button.',
      },
      exportButtonLabel: {
        message: 'Export',
        context: 'Label for the Export button.',
      },
      removeButtonLabel: {
        message: 'Remove',
        context: 'Label for the Remove button.',
      },
      renameButtonLabel: {
        message: 'Rename',
        context: 'Label for the Rename button.',
      },
      resetButtonLabel: {
        message: 'Reset',
        context: 'Label for the Reset button.',
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
