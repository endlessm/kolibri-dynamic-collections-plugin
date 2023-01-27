function defaultState() {
  return {
    collectionMetadata: {},
    selectedChannels: {},
    selectedNodeIdsByChannel: {},
    contentTags: {},
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
      state.contentTags = payload.contentTags || {};
    },
  },
  getters: {
    collectionDataObject(state) {
      const channelsList = [];

      for (const [channelId, channelVersion] of Object.entries(state.selectedChannels)) {
        const nodeIds = state.selectedNodeIdsByChannel[channelId];
        channelsList.push({
          id: channelId,
          version: channelVersion,
          include_node_ids: nodeIds,
        });
      }

      // TODO: Can we calculate channel_list_hash the same way as on the
      //       server? Or should we move this functionality to the server
      //       anyway?

      return {
        channels: channelsList,
        content_tags: state.contentTags,
        metadata: state.collectionMetadata,
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

      for (const channel of dataObject.channels) {
        // TODO: Report error (and provide migration options) on mismatched channel versions
        const existingVersion = selectedChannels[channel.id];
        if (existingVersion === undefined || channel.id > existingVersion) {
          selectedChannels[channel.id] = channel.version;
          selectedNodeIdsByChannel[channel.id] = channel.include_node_ids;
        }
      }

      store.commit('SET_STATE', {
        collectionMetadata: dataObject.metadata,
        selectedChannels,
        selectedNodeIdsByChannel,
        contentTags: dataObject.content_tags,
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
        selectedNodeIdsByChannel[channel.id] = [channel.id];
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
    setNodeIncluded(store, { channelId, nodeId, included }) {
      const selectedNodeIdsByChannel = { ...store.state.selectedNodeIdsByChannel };

      const channelNodeIds = new Set(selectedNodeIdsByChannel[channelId]);
      if (included) {
        channelNodeIds.add(nodeId);
      } else {
        channelNodeIds.delete(nodeId);
      }
      selectedNodeIdsByChannel[channelId] = Array.from(channelNodeIds);

      store.commit('SET_STATE', { ...store.state, selectedNodeIdsByChannel });
    },
  },
};
