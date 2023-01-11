const DEFAULT_EDITOR_DATA = {
  "channels": [],
  "metadata": {}
};

function defaultState() {
  return {
    collectionEditorData: DEFAULT_EDITOR_DATA,
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
      state.collectionEditorData = payload.collectionEditorData || {};
    },
  },
  getters: {
    channelSelectionsList(state) {
      return state.collectionEditorData.channels.map(
        channel => ({
          id: channel.id,
          name: channel.id,
          nodesCount: 0,
          size: 0,
        })
      );
    },
  },
  actions: {
    // TODO: Can we use a proper immutable object library here?
    resetState(store) {
      store.commit('RESET_STATE');
    },
    setCollectionEditorDataFromFile(store, {file}) {
      return file.text().then(
        fileText => {
          let collectionEditorData = undefined;
          try {
            collectionEditorData = JSON.parse(fileText);
          } catch (error) {
            console.log("Error reading JSON file", error);
          }
          if (collectionEditorData) {
            store.commit('SET_STATE', {collectionEditorData});
          }
        }
      )
    },
    setMetadata(store, {metadata}) {
      const collectionEditorData = {
        ...store.state.collectionEditorData,
        metadata: {
          ...store.state.collectionEditorData.metadata,
          ...metadata
        }
      };
      store.commit('SET_STATE', {collectionEditorData});
    },
    addChannels(store, {channelIds}) {
      const collectionEditorData = {
        ...store.state.collectionEditorData,
        channels: [
          ...store.state.collectionEditorData.channels,
          ...channelIds.map(
            // TODO: Add channel version
            channelId => ({
              id: channelId,
              include_node_ids: undefined,
              version: 0
            })
          )
        ]
      };
      store.commit('SET_STATE', {collectionEditorData});
    },
    removeChannel(store, {channelId}) {
      const collectionEditorData = {
        ...store.state.collectionEditorData,
        channels: store.state.collectionEditorData.channels.filter(
          channelData => (channelData.id !== channelId)
        )
      };
      store.commit('SET_STATE', {collectionEditorData});
    },
    setNodeIncluded(store, {channelId, nodeId, included}) {
      const collectionEditorData = Object.assign({}, store.state.collectionEditorData, {
        channels: store.state.collectionEditorData.channels.map(
          channelData => {
            if (channelData.id === channelId) {
              const includeNodeIds = new Set(channelData.include_node_ids);
              if (included) {
                includeNodeIds.add(nodeId);
              } else {
                includeNodeIds.delete(nodeId);
              }
              return Object.assign({}, channelData, {
                include_node_ids: Array.from(includeNodeIds)
              });
            } else {
              return channelData;
            }
          }
        )
      });
      store.commit('SET_STATE', {collectionEditorData});
    }
  }
};
