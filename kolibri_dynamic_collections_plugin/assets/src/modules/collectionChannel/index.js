function defaultState() {
  return {
    channel: {},
    topic: {},
    children: [],
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
    }
  },
  getters: {},
};
