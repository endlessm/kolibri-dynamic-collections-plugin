function defaultState() {
  return {
    channel: {},
    topic: {},
    children: [],
    selectionRanges: [],
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
      state.channel = payload.channel || {};
      state.topic = payload.topic || {};
      state.children = payload.children || [];
    },
  },
  getters: {
    selectedNodeIds(state, getters, rootState) {
      return rootState.collectionBase.selectedNodeIdsByChannel[state.channel.id] || [];
    },
  },
};
