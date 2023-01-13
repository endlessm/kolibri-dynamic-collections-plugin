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
          <div class="collection-info-grid">
            <div class="collection-info-main">
              <span v-if="collectionName" class="collection-name">
                {{ collectionName }}
              </span>
              <span v-else class="collection-name-untitled">
                {{ $tr('untitledCollectionLabel') }}
              </span>
            </div>
            <div class="collection-info-edit">
              <KButton
                appearance="basic-link"
                icon="edit"
                :title="$tr('renameButtonLabel')"
                :ariaLabel="$tr('renameButtonLabel')"
                @click="showEditCollectionMetadataModal = true"
              />
            </div>
          </div>
        </KGridItem>
        <KGridItem
          class="collection-actions"
          :layout="{ alignment: 'right' }"
          :layout8="{ span: 4 }"
          :layout12="{ span: 6 }"
        >
          <KButtonGroup>
            <KDropdownMenu
              appearance="raised-button"
              :options="dropdownOptions"
              :text="coreString('optionsLabel')"
              @select="onOptionsDropdownSelected"
            />
            <KButton
              :text="$tr('addChannelButtonLabel')"
              :primary="true"
              :style="{ marginLeft: 0 }"
              @click="showAddChannelModal = true"
            />
          </KButtonGroup>
        </KGridItem>
      </KGrid>

      <CoreTable v-if="selectedChannelIds.length > 0" class="channels-table">
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
            <tr v-for="channelId in selectedChannelIds" :key="channelId">
              <td>
                <CollectionChannelLinkButton
                  :channelId="channelId"
                  @click="onEditClicked(channelId)"
                />
              </td>
              <td>{{ $formatNumber(0) }}</td>
              <td>{{ $formatNumber(bytesToMB(0)) }} MB</td>
              <td class="core-table-button-col">
                <KButton
                  appearance="flat-button"
                  :text="$tr('removeButtonLabel')"
                  @click="onRemoveClicked(channelId)"
                />
              </td>
            </tr>
          </tbody>
        </template>
      </CoreTable>
      <div v-else class="empty-collection-form">
        <p>
          <label for="json-file"> {{ $tr('fileInputLabel') }}</label>
        </p>
        <p>
          <input
            id="json-file"
            ref="fileInput"
            type="file"
            accept=".json"
            name="json-file"
            @change="onFileInputChange"
          >
        </p>
      </div>
    </KPageContainer>

    <AddChannelModal
      v-if="showAddChannelModal"
      :existingChannels="selectedChannelIds"
      @submit="onAddChannelModalSubmit"
      @cancel="showAddChannelModal = false"
    />

    <EditCollectionMetadataModal
      v-if="showEditCollectionMetadataModal"
      :defaultMetadata="collectionMetadata"
      @submit="onEditCollectionMetadataModalSubmit"
      @cancel="showEditCollectionMetadataModal = false"
    />
  </CoreBase>

</template>


<script>

  import { mapActions, mapGetters, mapState } from 'vuex';
  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import dynamicCollectionsUtilsMixin from '../mixins/dynamicCollectionsUtilsMixin';
  import CollectionChannelLinkButton from '../components/CollectionChannelLinkButton';
  import AddChannelModal from '../components/AddChannelModal';
  import EditCollectionMetadataModal from '../components/EditCollectionMetadataModal';

  const EXPORT_OPTION = 'EXPORT';
  const RESET_OPTION = 'RESET';

  export default {
    name: 'CollectionEditorPage',
    components: {
      AddChannelModal,
      CoreBase,
      CoreTable,
      CollectionChannelLinkButton,
      EditCollectionMetadataModal,
    },
    mixins: [commonCoreStrings, dynamicCollectionsUtilsMixin],
    data() {
      return {
        showAddChannelModal: false,
        showEditCollectionMetadataModal: false,
      };
    },
    computed: {
      ...mapState('collectionBase', ['collectionMetadata']),
      ...mapGetters('collectionBase', ['collectionDataObject', 'selectedChannelIds']),
      collectionName() {
        const { title, subtitle, description } = this.collectionMetadata;
        if (title && subtitle && description) {
          return `${description} - ${subtitle} - ${title}`;
        } else {
          return undefined;
        }
      },
      downloadFileName() {
        const { description, subtitle } = this.collectionMetadata;
        if (description && subtitle) {
          return `${description.toLowerCase()}-${subtitle.toLowerCase()}.json`;
        } else {
          return `collection.json`;
        }
      },
      dropdownOptions() {
        return [
          { label: this.$tr('exportButtonLabel'), value: EXPORT_OPTION },
          { label: this.$tr('resetButtonLabel'), value: RESET_OPTION },
        ];
      },
    },
    methods: {
      ...mapActions(['resetCollectionEditorState']),
      ...mapActions('collectionBase', [
        'setCollectionEditorDataFromFile',
        'addChannels',
        'removeChannel',
        'setCollectionMetadata',
      ]),
      exportAsJSON() {
        // TODO: Instead of creating a blob here, add an API endpoint which
        //       returns a JSON file and window.open() that.
        const dataStr = JSON.stringify(this.collectionDataObject, null, 2);
        const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
        const linkElem = document.createElement('a');
        linkElem.href = URL.createObjectURL(blob);
        linkElem.download = this.downloadFileName;
        linkElem.click();
        URL.revokeObjectURL(linkElem.href);
      },
      onAddChannelModalSubmit({ channels }) {
        this.addChannels({ channels });
        this.showAddChannelModal = false;
      },
      onEditCollectionMetadataModalSubmit({ metadata }) {
        this.setCollectionMetadata({ collectionMetadata: metadata });
        this.showEditCollectionMetadataModal = false;
      },
      onRemoveClicked(channelId) {
        this.removeChannel({ channelId });
      },
      onOptionsDropdownSelected({ value }) {
        if (value === EXPORT_OPTION) {
          this.exportAsJSON();
        } else if (value === RESET_OPTION) {
          this.resetCollectionEditorState();
        }
      },
      onFileInputChange(event) {
        event.preventDefault();
        // TODO: This should be in an action.
        const file = this.$refs.fileInput.files[0];
        if (!file) {
          return;
        }
        this.setCollectionEditorDataFromFile({ file });
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
      untitledCollectionLabel: {
        message: 'Untitled',
        context: 'Label for an untitled collection',
      },
      fileInputLabel: {
        message: 'Start adding channels, or upload an existing collection manifest.',
        context: 'Label for the file input form',
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

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  .collection-info-grid {
    display: flex;
    flex-direction: row;

    .collection-name-untitled {
      font-style: italic;
    }

    .collection-info-main {
      margin-right: 8px;
    }
  }

  .collection-actions,
  .channels-table,
  .empty-collection-form {
    /* 24px is a magic number used for ".move-down" in some Kolibri core plugins */
    margin-top: 24px;
  }

  .empty-collection-form {
    border-top: solid $ui-input-border-width $ui-input-border-color;
  }

</style>
