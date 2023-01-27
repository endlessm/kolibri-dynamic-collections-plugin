export function showCollection(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);

  return Promise.all([store.dispatch('setAllChannelInfo')])
    .then(() => {
      store.commit('CORE_SET_PAGE_LOADING', false);
      store.commit('CORE_SET_ERROR', null);
    })
    .catch(error => {
      return store.dispatch('handleApiError', error);
    });
}
