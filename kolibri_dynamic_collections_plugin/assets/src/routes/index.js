import store from 'kolibri.coreVue.vuex.store';
import CollectionEditorPage from '../views/CollectionEditorPage';
import CollectionEditorChannelPage from '../views/CollectionEditorChannelPage';
import { showCollection, showCollectionChannel } from '../modules/collectionContent/handlers';
import { PageNames } from '../constants';

export default [
  {
    name: PageNames.COLLECTION_EDITOR_OVERVIEW,
    path: '/editor',
    component: CollectionEditorPage,
    handler(toRoute, fromRoute) {
      store.commit('SET_PAGE_NAME', PageNames.COLLECTION_EDITOR_OVERVIEW);
      showCollection(store);
    },
  },
  {
    name: PageNames.COLLECTION_EDITOR_CHANNEL,
    path: '/editor/:channelId',
    component: CollectionEditorChannelPage,
    handler(toRoute, fromRoute) {
      const {channelId} = toRoute.params;
      store.commit('SET_PAGE_NAME', PageNames.COLLECTION_EDITOR_CHANNEL);
      showCollectionChannel(store, channelId);
    },
  },
  {
    name: PageNames.ROOT,
    path: '/',
    // Redirect to CollectionEditorPage
    beforeEnter(to, from, next) {
      store.commit('SET_PAGE_NAME', PageNames.ROOT);
      next({ name: 'CollectionEditorPage', replace: true });
    },
  },
];
