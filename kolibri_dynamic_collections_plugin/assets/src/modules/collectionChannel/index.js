function defaultState() {
  return {
    channelId: null,
    cachedNodesDetails: [],
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
      state.channelId = payload.channelId || null;
      state.cachedNodesDetails = payload.cachedNodesDetails || [];
    },
  },
  getters: {
    selectedNodeIds(state, getters, rootState) {
      return rootState.collectionBase.selectedNodeIdsByChannel[state.channelId] || [];
    },
    selectedNodes(state, getters) {
      return state.cachedNodesDetails.filter(contentNode =>
        getters.selectedNodeIds.includes(contentNode.id)
      );
    },
  },
};
