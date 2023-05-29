export function showCollection(store) {
  return Promise.all([store.dispatch('setAllChannelInfo')])
    .catch(error => {
      return store.dispatch('handleApiError', error);
    });
}
