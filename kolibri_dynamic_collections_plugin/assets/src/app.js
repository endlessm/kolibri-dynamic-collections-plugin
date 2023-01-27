import PageRoot from 'kolibri.coreVue.components.PageRoot';
import KolibriApp from 'kolibri_app';
import { setAllChannelInfo } from './modules/coreCollections/actions';
import routes from './routes';
import pluginModule from './modules/pluginModule';

class DynamicCollectionsModule extends KolibriApp {
  get stateSetters() {
    return [setAllChannelInfo];
  }
  get routes() {
    return routes;
  }
  get RootVue() {
    return PageRoot;
  }
  get pluginModule() {
    return pluginModule;
  }
  ready() {
    super.ready();
  }
}

export default new DynamicCollectionsModule();
