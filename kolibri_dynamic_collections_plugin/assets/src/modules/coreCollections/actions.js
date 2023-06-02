import { ChannelResource } from 'kolibri.resources';

/* Adapted from kolibri/core/assets/src/state/modules/core/actions.js
 * with a change to include channels that are not marked as available.
 * <https://github.com/learningequality/kolibri/blob/release-v0.15.x/kolibri/core/assets/src/state/modules/core/actions.js>
 */

function _channelListState(data) {
  return data.map(channel => ({
    id: channel.id,
    title: channel.name,
    description: channel.description,
    tagline: channel.tagline,
    root_id: channel.root,
    last_updated: channel.last_updated,
    version: channel.version,
    thumbnail: channel.thumbnail,
    num_coach_contents: channel.num_coach_contents,
  }));
}

function _sanitize(collectionDataObject) {
  const existingNodes = collectionDataObject.channels
    .map(channel => [channel.id, ...channel.include_node_ids])
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
  const tagsSanitized = collectionDataObject.metadata.tagged_node_ids.filter(tagged => {
    if (tagged.tags.length === 0) {
      return false;
    }
    if (!existingNodes.includes(tagged.node_id)) {
      return false;
    }
    return true;
  });
  collectionDataObject.metadata.tagged_node_ids = tagsSanitized;
  return collectionDataObject;
}

export function exportCollectionEditorData(store) {
  // TODO: Instead of creating a blob here, add an API endpoint which
  //       returns a JSON file and window.open() that.

  const collectionDataObject = _sanitize(store.getters['collectionBase/collectionDataObject']);
  const downloadFileName = store.getters['collectionBase/downloadFileName'];
  const dataStr = JSON.stringify(collectionDataObject, null, 2);

  const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
  const linkElem = document.createElement('a');
  linkElem.href = URL.createObjectURL(blob);
  linkElem.download = downloadFileName;
  linkElem.click();

  URL.revokeObjectURL(linkElem.href);
}

export function resetCollectionEditorState(store) {
  store.commit('collectionBase/RESET_STATE');
  store.commit('collectionChannel/RESET_STATE');
}

export function setAllChannelInfo(store) {
  return ChannelResource.fetchCollection({ getParams: {} }).then(
    channelsData => {
      store.commit('SET_CORE_CHANNEL_LIST', _channelListState(channelsData));
      return channelsData;
    },
    error => {
      store.dispatch('handleApiError', error);
      return error;
    }
  );
}
