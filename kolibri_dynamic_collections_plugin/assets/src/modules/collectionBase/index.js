function defaultState() {
  return {
    collectionMetadata: {},
    selectedChannels: {},
    selectedNodeIdsByChannel: {},
    externalTagsByNode: {},
  };
}

export default {
  namespaced: true,
  state: defaultState(),
  mutations: {
    RESET_STATE(state) {
      Object.assign(state, defaultState());
    },
    SET_STATE(state, payload) {
      state.collectionMetadata = payload.collectionMetadata || {};
      state.selectedChannels = payload.selectedChannels || {};
      state.selectedNodeIdsByChannel = payload.selectedNodeIdsByChannel || {};
      state.externalTagsByNode = payload.externalTagsByNode || {};
    },
  },
  getters: {
    collectionDataObject(state) {
      const channelsList = [];
      const taggedNodeIds = [];

      for (const [channelId, channelVersion] of Object.entries(state.selectedChannels)) {
        const nodeIds = state.selectedNodeIdsByChannel[channelId];
        channelsList.push({
          id: channelId,
          version: channelVersion,
          include_node_ids: nodeIds,
        });
      }

      for (const [nodeId, tags] of Object.entries(state.externalTagsByNode)) {
        taggedNodeIds.push({
          node_id: nodeId,
          tags: tags,
        });
      }

      // TODO: Can we calculate channel_list_hash the same way as on the
      //       server? Or should we move this functionality to the server
      //       anyway?

      return {
        channels: channelsList,
        metadata: {
          ...state.collectionMetadata,
          tagged_node_ids: taggedNodeIds,
        },
        channel_list_hash: '',
      };
    },
    downloadFileName(state) {
      const { description, subtitle } = state.collectionMetadata;
      if (description && subtitle) {
        return `${description.toLowerCase()}-${subtitle.toLowerCase()}.json`;
      } else {
        return `collection.json`;
      }
    },
    selectedChannelIds(state, getters, rootState) {
      const allChannels = rootState.core.channels.list;
      // We use allChannels here so known channels appear in a consistent order.
      const existingChannelIds = allChannels
        .map(channel => channel.id)
        .filter(channelId => channelId in state.selectedChannels);
      const extraChannelIds = Object.keys(state.selectedChannels)
        .filter(channelId => !existingChannelIds.includes(channelId))
        .sort();
      return [...existingChannelIds, ...extraChannelIds];
    },
  },
  actions: {
    // TODO: Can we use a proper immutable object library here?
    resetState(store) {
      store.commit('RESET_STATE');
    },
    setCollectionEditorDataFromFile(store, { file }) {
      return file.text().then(fileText => {
        let dataObject = undefined;
        try {
          dataObject = JSON.parse(fileText);
        } catch (error) {
          console.log('Error reading JSON file', error);
        }
        if (!dataObject) {
          return;
        }
        store.dispatch('setCollectionEditorDataFromObject', { dataObject });
      });
    },
    setCollectionEditorDataFromObject(store, { dataObject }) {
      const selectedChannels = {};
      const selectedNodeIdsByChannel = {};
      const externalTagsByNode = {};
      const { tagged_node_ids, ...collectionMetadata } = dataObject.metadata;

      for (const channel of dataObject.channels) {
        // TODO: Report error (and provide migration options) on mismatched channel versions
        const existingVersion = selectedChannels[channel.id];
        if (existingVersion === undefined || channel.id > existingVersion) {
          selectedChannels[channel.id] = channel.version;
          selectedNodeIdsByChannel[channel.id] = channel.include_node_ids;
        }
      }

      for (const { node_id, tags } of tagged_node_ids) {
        externalTagsByNode[node_id] = tags.slice().sort();
      }

      store.commit('SET_STATE', {
        collectionMetadata,
        selectedChannels,
        selectedNodeIdsByChannel,
        externalTagsByNode,
      });
    },
    setCollectionMetadata(store, { collectionMetadata }) {
      store.commit('SET_STATE', { ...store.state, collectionMetadata });
    },
    addChannels(store, { channels }) {
      const selectedChannels = { ...store.state.selectedChannels };
      const selectedNodeIdsByChannel = { ...store.state.selectedNodeIdsByChannel };
      for (const channel of channels) {
        selectedChannels[channel.id] = channel.version;
        selectedNodeIdsByChannel[channel.id] = [];
      }
      store.commit('SET_STATE', { ...store.state, selectedChannels, selectedNodeIdsByChannel });
    },
    removeChannel(store, { channelId }) {
      const selectedChannels = { ...store.state.selectedChannels };
      const selectedNodeIdsByChannel = { ...store.state.selectedNodeIdsByChannel };
      delete selectedChannels[channelId];
      delete selectedNodeIdsByChannel[channelId];
      store.commit('SET_STATE', { ...store.state, selectedChannels, selectedNodeIdsByChannel });
    },
    addSelectedNodes(store, { channelId, nodeIds }) {
      const selectedNodeIdsByChannel = { ...store.state.selectedNodeIdsByChannel };

      const channelNodeIds = new Set(selectedNodeIdsByChannel[channelId]);
      for (const nodeId of nodeIds) {
        channelNodeIds.add(nodeId);
      }
      selectedNodeIdsByChannel[channelId] = Array.from(channelNodeIds);

      store.commit('SET_STATE', { ...store.state, selectedNodeIdsByChannel });
    },
    removeSelectedNode(store, { channelId, nodeId }) {
      const selectedNodeIdsByChannel = { ...store.state.selectedNodeIdsByChannel };

      const channelNodeIds = new Set(selectedNodeIdsByChannel[channelId]);
      channelNodeIds.delete(nodeId);
      selectedNodeIdsByChannel[channelId] = Array.from(channelNodeIds);

      store.commit('SET_STATE', { ...store.state, selectedNodeIdsByChannel });
    },
    setExternalTagsForNodes(store, { nodeIds, tagIds }) {
      const externalTagsByNode = { ...store.state.externalTagsByNode };
      nodeIds.forEach(nodeId => {
        externalTagsByNode[nodeId] = tagIds.slice().sort();
      });
      store.commit('SET_STATE', { ...store.state, externalTagsByNode });
    },
    changeExternalTagsForNodes(store, { nodeIds, addTagIds = [], removeTagIds = [] }) {
      const externalTagsByNode = { ...store.state.externalTagsByNode };
      nodeIds.forEach(nodeId => {
        const externalTags = new Set(externalTagsByNode[nodeId]);
        addTagIds.forEach(tagId => externalTags.add(tagId));
        removeTagIds.forEach(tagId => externalTags.delete(tagId));
        externalTagsByNode[nodeId] = Array.from(externalTags).sort();
      });
      store.commit('SET_STATE', { ...store.state, externalTagsByNode });
    },
  },
};
