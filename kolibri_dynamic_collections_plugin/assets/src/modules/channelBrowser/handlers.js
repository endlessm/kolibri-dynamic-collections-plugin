import samePageCheckGenerator from 'kolibri.utils.samePageCheckGenerator';
import { AllContentNodeResource } from '../../api-resources';
import { normalizeContentNode } from '../coreCollections/utils';

export function showChannelBrowser(store, { channelId, topicId }) {
  topicId = topicId || channelId;

  const shouldResolve = samePageCheckGenerator(store);

  return Promise.all([
    AllContentNodeResource.fetchModel({ id: topicId }),
    AllContentNodeResource.fetchCollection({ getParams: { parent: topicId } }),
    store.dispatch('setAllChannelInfo'),
  ])
    .then(([topicNode, childNodes]) => {
      if (shouldResolve()) {
        store.commit('channelBrowser/SET_STATE', {
          topic: normalizeContentNode(topicNode),
          children: childNodes.map(normalizeContentNode),
        });
      }
    })
    .catch(error => {
      shouldResolve() ? store.dispatch('handleApiError', error) : null;
    });
}
