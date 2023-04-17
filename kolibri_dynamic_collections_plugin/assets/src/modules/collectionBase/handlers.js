export function showCollection(store) {
  return Promise.all([store.dispatch('setAllChannelInfo')])
    .then(() => {
      // nothing to do...
    })
    .catch(error => {
      return store.dispatch('handleApiError', error);
    });
}
