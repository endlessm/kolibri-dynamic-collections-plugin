import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
import tail from 'lodash/tail';
import { AllContentNodeResource } from '../../api-resources';

export function loadContentNodeDetails(node) {
  // Inefficiently fetch additional details about a content node, which
  // includes asking the server for a list of all of its children.
  // FIXME: Replace this with a custom API that returns the data we need using
  //        a single request: <https://phabricator.endlessm.com/T34841>
  return calculateTotalSizeForNode(node).then(totalSize => ({
    ...normalizeContentNode(node),
    total_file_size: totalSize,
  }));
}

export function normalizeContentNode(node) {
  // Add additional content node fields that are convenient to have.
  return {
    ...node,
    kind: node.parent ? node.kind : ContentNodeKinds.CHANNEL,
    thumbnail: getContentNodeThumbnail(node) || null,
    breadcrumbs: tail(node.ancestors),
    total_file_size: calculateTotalSizeForFiles(node.files),
  };
}

function calculateTotalSizeForNode(node) {
  if (node.is_leaf) {
    return Promise.resolve(calculateTotalSizeForFiles(node.files));
  }

  return AllContentNodeResource.fetchCollection({
    getParams: {
      channel_id: node.channel_id,
      tree_id: node.tree_id,
      lft__gt: node.lft,
      rght__lt: node.rght,
    },
  }).then(children =>
    children.reduce((sum, child) => sum + calculateTotalSizeForFiles(child.files), 0)
  );
}

function calculateTotalSizeForFiles(files) {
  return files.reduce((total, file) => total + file.file_size, 0);
}
