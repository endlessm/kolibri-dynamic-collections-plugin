<template>

  <CoreMenuOption
    :label="$tr('navLabel')"
    :link="url"
    icon="dashboard"
  />

</template>


<script>

  import CoreMenuOption from 'kolibri.coreVue.components.CoreMenuOption';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import navComponents from 'kolibri.utils.navComponents';
  import urls from 'kolibri.urls';

  const component = {
    name: 'DynamicCollectionsSideNavEntry',
    components: {
      CoreMenuOption,
    },
    mixins: [commonCoreStrings],
    computed: {
      url() {
        return urls['kolibri:kolibri_dynamic_collections_plugin:root']();
      },
    },
    priority: 15,
    $trs: {
      navLabel: {
        message: 'Collections Editor',
        context: 'Label for the Collections Editor sidebar navigation item.',
      },
    },
  };

  navComponents.register(component);

  export default component;

</script>
