import { ContentNodeResource } from 'kolibri.resources';
import samePageCheckGenerator from 'kolibri.utils.samePageCheckGenerator';
import { normalizeContentNode } from '../coreCollections/utils';

export function showCollection(store) {
  return store
    .dispatch('loading')
    .then(() => {
      store.commit('CORE_SET_PAGE_LOADING', false);
      store.commit('CORE_SET_ERROR', null);
    })
    .catch(error => {
      return store.dispatch('handleApiError', error);
    });
}

export function showCollectionChannel(store, channelId) {
  store.commit('CORE_SET_PAGE_LOADING', true);

  const promises = [
    ContentNodeResource.fetchModel({ id: channelId, force: true }),
    store.dispatch('setChannelInfo'),
  ];
  const shouldResolve = samePageCheckGenerator(store);
  Promise.all(promises).then(
    ([topic]) => {
      if (shouldResolve()) {
        const currentChannel = store.getters.getChannelObject(topic.channel_id);

        store.commit('collectionContent/SET_STATE', {
          channel: currentChannel,
          topic: normalizeContentNode(topic),
        });

        store.commit('CORE_SET_PAGE_LOADING', false);
        store.commit('CORE_SET_ERROR', null);
      }
    },
    error => {
      // TODO: If the channel is unavailable, we should handle it gracefully
      //       by displaying a page which offers to import the missing channel
      //       metadata.
      shouldResolve() ? store.dispatch('handleApiError', error) : null;
    }
  );
}
