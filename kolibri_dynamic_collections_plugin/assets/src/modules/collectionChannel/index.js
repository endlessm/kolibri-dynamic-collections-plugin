function defaultState() {
  return {
    channelId: null,
    selectedNodes: [],
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
      state.selectedNodes = payload.selectedNodes || [];
    },
  },
  getters: {
    selectedNodeIds(state) {
      return state.selectedNodes.map(node => node.id);
    },
  },
};
