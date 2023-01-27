import store from 'kolibri.coreVue.vuex.store';
import CollectionEditorPage from '../views/CollectionEditorPage';
import CollectionEditorChannelPage from '../views/CollectionEditorChannelPage';
import { showCollection } from '../modules/collectionBase/handlers';
import { showCollectionChannel } from '../modules/collectionChannel/handlers';
import { PageNames } from '../constants';

export default [
  {
    name: PageNames.COLLECTION_EDITOR_OVERVIEW,
    path: '/editor',
    component: CollectionEditorPage,
    handler() {
      store.commit('SET_PAGE_NAME', PageNames.COLLECTION_EDITOR_OVERVIEW);
      showCollection(store);
    },
  },
  {
    name: PageNames.COLLECTION_EDITOR_CHANNEL,
    path: '/editor/:channelId',
    component: CollectionEditorChannelPage,
    handler(toRoute) {
      const { channelId } = toRoute.params;
      store.commit('SET_PAGE_NAME', PageNames.COLLECTION_EDITOR_CHANNEL);
      showCollectionChannel(store, { channelId });
    },
  },
  {
    name: PageNames.COLLECTION_EDITOR_CHANNEL_TOPIC,
    path: '/editor/:channelId/:topicId',
    component: CollectionEditorChannelPage,
    handler(toRoute) {
      const { channelId, topicId } = toRoute.params;
      store.commit('SET_PAGE_NAME', PageNames.COLLECTION_EDITOR_CHANNEL);
      showCollectionChannel(store, { channelId, topicId });
    },
  },
  {
    name: PageNames.ROOT,
    path: '/',
    // Redirect to CollectionEditorPage
    beforeEnter(to, from, next) {
      store.commit('SET_PAGE_NAME', PageNames.ROOT);
      next({ name: PageNames.COLLECTION_EDITOR_OVERVIEW, replace: true });
    },
  },
];
