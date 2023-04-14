import samePageCheckGenerator from 'kolibri.utils.samePageCheckGenerator';
import { AllContentNodeResource } from '../../api-resources';
import { loadContentNodeDetails } from '../coreCollections/utils';

export function showChannelBrowser(store, { channelId, topicId }) {
  topicId = topicId || channelId;

  const shouldResolve = samePageCheckGenerator(store);

  return Promise.all([
    AllContentNodeResource.fetchModel({ id: topicId }),
    AllContentNodeResource.fetchCollection({ getParams: { parent: topicId } }),
    store.dispatch('setAllChannelInfo'),
  ])
    .then(([topicNode, childNodes]) =>
      Promise.all([
        loadContentNodeDetails(topicNode),
        Promise.all(childNodes.map(loadContentNodeDetails)),
      ])
    )
    .then(([topicNode, childNodes]) => {
      if (!shouldResolve()) {
        return;
      }
      store.commit('channelBrowser/SET_STATE', {
        topic: topicNode,
        children: childNodes,
      });
    })
    .catch(error => {
      if (!shouldResolve()) {
        return;
      }
      store.dispatch('handleApiError', error);
    });
}
