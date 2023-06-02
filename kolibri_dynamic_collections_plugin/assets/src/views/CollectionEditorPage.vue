<template>

  <CoreBase
    :appBarTitle="$tr('collectionAppBarTitle')"
    :toolbarTitle="$tr('collectionAppBarTitle')"
    :immersivePage="false"
    :showSubNav="false"
  >
    <KPageContainer>
      <EditorPageHeader :title="$tr('editorHeader')">
        <template #subtitle>
          <span v-if="collectionName" class="collection-name">{{ collectionName }}</span>
          <span v-else class="collection-name-untitled">{{ $tr('untitledCollectionLabel') }}</span>
          <KButton
            appearance="basic-link"
            icon="edit"
            :style="{ marginLeft: '8px' }"
            :title="$tr('renameButtonLabel')"
            :ariaLabel="$tr('renameButtonLabel')"
            @click="showEditCollectionMetadataModal = true"
          />
        </template>
        <template #actions>
          <CollectionEditorOptionsMenu
            @exportOptionSelect="exportCollectionEditorData"
            @resetOptionSelect="onResetOptionSelect"
          />
        </template>
      </EditorPageHeader>

      <EditorSectionHeader :title="$tr('channelsSectionTitle')">
        <template #actions>
          <KButton
            :text="$tr('addChannelButtonLabel')"
            :primary="true"
            :style="{ marginLeft: 0 }"
            @click="showAddChannelModal = true"
          />
        </template>
      </EditorSectionHeader>

      <CollectionChannelTable
        v-if="selectedChannelIds.length > 0"
        class="channels-table"
        :channelIds="selectedChannelIds"
      >
        <template #channelActions="{ channelId }">
          <KIconButton
            appearance="flat-button"
            icon="remove"
            :title="$tr('removeChannelButtonTooltip')"
            @click="removeChannel({ channelId })"
          />
        </template>
      </CollectionChannelTable>
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
  import CollectionChannelTable from '../components/CollectionChannelTable';
  import AddChannelModal from '../components/AddChannelModal';
  import EditorPageHeader from '../components/EditorPageHeader';
  import CollectionEditorOptionsMenu from '../components/CollectionEditorOptionsMenu';
  import EditCollectionMetadataModal from '../components/EditCollectionMetadataModal';
  import EditorSectionHeader from '../components/EditorSectionHeader';

  export default {
    name: 'CollectionEditorPage',
    components: {
      AddChannelModal,
      CoreBase,
      CollectionChannelTable,
      CollectionEditorOptionsMenu,
      EditorPageHeader,
      EditCollectionMetadataModal,
      EditorSectionHeader,
    },
    data() {
      return {
        showAddChannelModal: false,
        showEditCollectionMetadataModal: false,
      };
    },
    computed: {
      ...mapState('collectionBase', ['collectionMetadata']),
      ...mapGetters('collectionBase', ['selectedChannelIds']),
      collectionName() {
        const { title, subtitle, description, required_gigabytes } = this.collectionMetadata;
        if (title && subtitle && description) {
          if (required_gigabytes) {
            return `${description} - ${subtitle} - ${title} (${required_gigabytes} GB)`;
          } else {
            return `${description} - ${subtitle} - ${title}`;
          }
        } else {
          return undefined;
        }
      },
    },
    methods: {
      ...mapActions(['exportCollectionEditorData', 'resetCollectionEditorState']),
      ...mapActions('collectionBase', [
        'setCollectionEditorDataFromFile',
        'addChannels',
        'removeChannel',
        'setCollectionMetadata',
      ]),
      onAddChannelModalSubmit({ channels }) {
        this.addChannels({ channels });
        this.showAddChannelModal = false;
      },
      onEditCollectionMetadataModalSubmit({ metadata }) {
        this.setCollectionMetadata({ collectionMetadata: metadata });
        this.showEditCollectionMetadataModal = false;
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
      onResetOptionSelect() {
        if (window.confirm(this.$tr('resetConfirmMessage'))) {
          this.resetCollectionEditorState();
        }
      },
    },
    $trs: {
      channelsSectionTitle: {
        message: 'Channels',
        context: 'Title of the Channels table',
      },
      addChannelButtonLabel: {
        message: 'Add Channel',
        context: 'Label for the Add Channel button.',
      },
      collectionAppBarTitle: {
        message: 'Dynamic Collections',
        context: 'App bar title for the collections plugin',
      },
      editorHeader: {
        message: 'Collection Editor',
        context: 'Title of the Collection Editor page.',
      },
      untitledCollectionLabel: {
        message: 'Untitled',
        context: 'Label for an untitled collection',
      },
      fileInputLabel: {
        message: 'Start adding channels, or upload an existing collection manifest.',
        context: 'Label for the file input form',
      },
      removeChannelButtonTooltip: {
        message: 'Remove Channel',
        context: 'Tooltip for the Remove Channel icon button.',
      },
      renameButtonLabel: {
        message: 'Rename',
        context: 'Label for the Rename button.',
      },
      resetConfirmMessage: {
        message: 'Would you like to reset the editor?',
        context: 'Sanity check for the Reset menu option',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import '~kolibri-design-system/lib/keen/styles/imports';

  .empty-collection-form {
    border-top: solid $ui-input-border-width $ui-input-border-color;
  }

</style>
