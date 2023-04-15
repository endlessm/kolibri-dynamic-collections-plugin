import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
import tail from 'lodash/tail';
import { AllContentNodeResource } from '../../api-resources';

export function loadContentNodeDetails(node) {
  // Inefficiently fetch additional details about a content node, which
  // includes asking the server for a list of all of its children.
  // FIXME: Replace this with a custom API that returns the data we need using
  //        a single request.
  return fetchDetailsForNode(node).then(({ total_file_size, descendant_node_ids }) => ({
    ...normalizeContentNode(node),
    total_file_size,
    descendant_node_ids,
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

function fetchDetailsForNode(node) {
  if (node.is_leaf) {
    return Promise.resolve({
      total_file_size: calculateTotalSizeForFiles(node.files),
      descendant_node_ids: [],
    });
  }

  return AllContentNodeResource.fetchCollection({
    getParams: {
      channel_id: node.channel_id,
      tree_id: node.tree_id,
      lft__gt: node.lft,
      rght__lt: node.rght,
    },
  }).then(children => ({
    total_file_size: children.reduce(
      (sum, child) => sum + calculateTotalSizeForFiles(child.files),
      0
    ),
    descendant_node_ids: children.map(child => child.id),
  }));
}

function calculateTotalSizeForFiles(files) {
  return files.reduce((total, file) => total + file.file_size, 0);
}
