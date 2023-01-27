import samePageCheckGenerator from 'kolibri.utils.samePageCheckGenerator';
import { AllContentNodeResource } from '../../api-resources';
import { normalizeContentNode } from '../coreCollections/utils';

export function showCollectionChannel(store, { channelId, topicId }) {
  topicId = topicId || channelId;

  store.commit('CORE_SET_PAGE_LOADING', true);

  const shouldResolve = samePageCheckGenerator(store);

  // TODO: We need a custom ContentNodeResource that includes unavailable content.

  return Promise.all([
    AllContentNodeResource.fetchModel({ id: channelId }),
    topicId !== channelId ? AllContentNodeResource.fetchModel({ id: topicId }) : Promise.resolve(),
    AllContentNodeResource.fetchCollection({ getParams: { parent: topicId } }),
    store.dispatch('setAllChannelInfo'),
  ]).then(
    ([rootNode, topicNode, childNodes]) => {
      topicNode = topicNode || rootNode;

      if (shouldResolve()) {
        store.commit('collectionChannel/SET_STATE', {
          channel: store.getters.getChannelObject(rootNode.channel_id),
          topic: normalizeContentNode(topicNode),
          children: childNodes.map(normalizeContentNode),
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
