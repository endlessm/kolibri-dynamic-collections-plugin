import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
import tail from 'lodash/tail';

// adds progress, thumbnail, and breadcrumbs. normalizes pk/id and kind
export function normalizeContentNode(node) {
  return {
    ...node,
    kind: node.parent ? node.kind : ContentNodeKinds.CHANNEL,
    thumbnail: getContentNodeThumbnail(node) || null,
    breadcrumbs: tail(node.ancestors),
    progress: Math.min(node.progress_fraction || 0, 1.0),
    total_file_size: calculateTotalFileSize(node.files),
  };
}

function calculateTotalFileSize(files) {
  return files.reduce((total, file) => total + file.file_size, 0);
}
