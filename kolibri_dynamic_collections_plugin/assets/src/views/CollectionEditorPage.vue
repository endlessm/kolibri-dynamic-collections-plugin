<template>

  <CoreBase
    :appBarTitle="$tr('collectionsAppBarTitle')"
    :toolbarTitle="$tr('collectionsAppBarTitle')"
    :immersivePage="false"
    :showSubNav="false"
  >
    <KPageContainer>
      <h1>{{ $tr('editorHeader') }}</h1>
      <CoreTable>
        <template #headers>
          <th>Channels</th>
          <th>Content nodes</th>
        </template>
        <template #tbody>
          <tbody>
            <tr>
              <td>
                Channel 1
              </td>
              <td>
                <ul>
                  <li>Content node 1</li>
                  <li>Content node 2</li>
                  <li>Content node 3</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </template>
      </CoreTable>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import CoreBase from 'kolibri.coreVue.components.CoreBase';
  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  export default {
    name: 'CollectionEditorPage',
    components: {
      CoreBase,
      CoreTable,
    },
    mixins: [commonCoreStrings],
    computed: {},
    $trs: {
      collectionsAppBarTitle: {
        message: 'Dynamic Collections',
        context: 'App bar title for the collections plugin',
      },
      editorHeader: {
        message: 'Collection Editor',
        context: 'Title of the Collections Editor page.',
      },
    },
  };

</script>


<style lang="scss" scoped></style>

