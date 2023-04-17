function defaultState() {
  return {
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
      state.topic = payload.topic || {};
      state.children = payload.children || [];
    },
  },
};
