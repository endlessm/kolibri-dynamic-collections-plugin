import store from 'kolibri.coreVue.vuex.store';
import CollectionEditorPage from '../views/CollectionEditorPage';

export default [
  {
    path: '/editor',
    component: CollectionEditorPage,
    handler() {
      store.dispatch('notLoading');
    },
  },
  {
    path: '/',
    // Redirect to CollectionEditorPage
    beforeEnter(to, from, next) {
      next({ name: 'CollectionEditorPage', replace: true });
    },
  },
];
