import samePageCheckGenerator from 'kolibri.utils.samePageCheckGenerator';
import { AllContentNodeResource } from '../../api-resources';
import { loadContentNodeDetails } from '../coreCollections/utils';

export function showCollectionChannel(store, { channelId }) {
  const shouldResolve = samePageCheckGenerator(store);
  const selectedNodeIds = store.state.collectionBase.selectedNodeIdsByChannel[channelId] || [];
  return Promise.all(
    selectedNodeIds.map(nodeId => AllContentNodeResource.fetchModel({ id: nodeId }))
  )
    .then(selectedNodes => Promise.all(selectedNodes.map(loadContentNodeDetails)))
    .then(cachedNodesDetails => {
      if (!shouldResolve()) {
        return;
      }
      store.commit('collectionChannel/SET_STATE', {
        channelId,
        cachedNodesDetails,
      });
    })
    .catch(error => {
      if (!shouldResolve()) {
        return;
      }
      // TODO: If the channel is unavailable, we should handle it gracefully
      //       by displaying a page which offers to import the missing channel
      //       metadata.
      store.dispatch('handleApiError', error);
    });
}
