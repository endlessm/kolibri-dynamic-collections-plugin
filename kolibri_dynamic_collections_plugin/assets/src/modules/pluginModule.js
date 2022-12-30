import mutations from './coreCollections/mutations';
import * as getters from './coreCollections/getters';
import * as actions from './coreCollections/actions';
import collectionContent from './collectionContent';

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
    collectionContent,
  },
};
