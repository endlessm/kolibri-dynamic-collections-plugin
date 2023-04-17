import store from 'kolibri.coreVue.vuex.store';
import CollectionEditorPage from '../views/CollectionEditorPage';
import CollectionEditorChannelPage from '../views/CollectionEditorChannelPage';
import CollectionEditorChannelAddContentPage from '../views/CollectionEditorChannelAddContentPage';
import { showChannelBrowser } from '../modules/channelBrowser/handlers';
import { showCollection } from '../modules/collectionBase/handlers';
import { showCollectionChannel } from '../modules/collectionChannel/handlers';
import { PageNames } from '../constants';

export default [
  {
    name: PageNames.COLLECTION_EDITOR_OVERVIEW,
    path: '/editor',
    component: CollectionEditorPage,
    handler() {
      showLoading(store, PageNames.COLLECTION_EDITOR_OVERVIEW)
        .then(() => showCollection(store))
        .finally(() => clearLoading(store));
    },
  },
  {
    name: PageNames.COLLECTION_EDITOR_CHANNEL,
    path: '/editor/:channelId',
    component: CollectionEditorChannelPage,
    handler(toRoute) {
      const { channelId } = toRoute.params;
      showLoading(store, PageNames.COLLECTION_EDITOR_CHANNEL)
        .then(() => showCollectionChannel(store, { channelId }))
        .finally(() => clearLoading(store));
    },
  },
  {
    name: PageNames.COLLECTION_EDITOR_CHANNEL_ADD_CONTENT,
    path: '/editor/:channelId/add/:topicId?',
    component: CollectionEditorChannelAddContentPage,
    handler(toRoute) {
      const { channelId, topicId } = toRoute.params;
      showLoading(store, PageNames.COLLECTION_EDITOR_CHANNEL_ADD_CONTENT)
        .then(() => showChannelBrowser(store, { channelId, topicId }))
        .finally(() => clearLoading(store));
    },
  },
  {
    name: PageNames.ROOT,
    path: '/',
    // Redirect to CollectionEditorPage
    beforeEnter(to, from, next) {
      showLoading(store, PageNames.ROOT)
        .then(() => next({ name: PageNames.COLLECTION_EDITOR_OVERVIEW, replace: true }))
        .finally(() => clearLoading(store));
    },
  },
];

function showLoading(store) {
  store.commit('CORE_SET_PAGE_LOADING', true);
  store.commit('CORE_SET_ERROR', null);
  return Promise.resolve();
}

function clearLoading(store) {
  store.commit('CORE_SET_PAGE_LOADING', false);
}
