import mutations from './coreCollections/mutations';
import * as getters from './coreCollections/getters';
import * as actions from './coreCollections/actions';
import collectionBase from './collectionBase';
import collectionChannel from './collectionChannel';

export default {
  state() {
    return {
      pageName: '',
      searchTerm: '',
      contentId: '',
    };
  },
  actions,
  getters,
  mutations,
  modules: {
    collectionBase,
    collectionChannel,
  },
};
