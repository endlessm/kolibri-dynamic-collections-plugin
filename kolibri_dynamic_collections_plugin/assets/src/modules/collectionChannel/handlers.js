import { ContentNodeResource } from 'kolibri.resources';
import samePageCheckGenerator from 'kolibri.utils.samePageCheckGenerator';
import { normalizeContentNode } from '../coreCollections/utils';

export function showCollectionChannel(store, { channelId, topicId }) {
  topicId = topicId || channelId;

  store.commit('CORE_SET_PAGE_LOADING', true);

  const shouldResolve = samePageCheckGenerator(store);

  // TODO: We need a custom ContentNodeResource that includes unavailable content.

  return Promise.all([
    ContentNodeResource.fetchModel({ id: channelId }),
    ContentNodeResource.fetchModel({ id: topicId }),
    ContentNodeResource.fetchCollection({ getParams: { parent: topicId } }),
    store.dispatch('setAllChannelInfo'),
  ]).then(
    ([rootNode, topic, children]) => {
      if (shouldResolve()) {
        store.commit('collectionChannel/SET_STATE', {
          channel: store.getters.getChannelObject(rootNode.channel_id),
          topic: normalizeContentNode(topic),
          children: children.map(normalizeContentNode),
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
