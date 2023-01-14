<template>

  <CoreTable class="channels-table">
    <template #headers>
      <th>{{ $tr('channelHeader') }}</th>
      <th>{{ $tr('itemsHeader') }}</th>
      <th>{{ $tr('sizeHeader') }}</th>
      <th>
        <span class="visuallyhidden">
          {{ coreString('userActionsColumnHeader') }}
        </span>
      </th>
    </template>
    <template #tbody>
      <tbody>
        <CollectionChannelTableRow
          v-for="channelId in channelIds"
          :key="channelId"
          :channelId="channelId"
        >
          <template #actions>
            <slot name="channelActions" :channelId="channelId"></slot>
          </template>
        </CollectionChannelTableRow>
      </tbody>
    </template>
  </CoreTable>

</template>


<script>

  import CoreTable from 'kolibri.coreVue.components.CoreTable';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import CollectionChannelTableRow from './CollectionChannelTableRow';

  export default {
    name: 'CollectionChannelTable',
    components: {
      CoreTable,
      CollectionChannelTableRow,
    },
    mixins: [commonCoreStrings],
    props: {
      channelIds: {
        type: Array,
        default: () => [],
      },
    },
    $trs: {
      channelHeader: {
        message: 'Channel',
      },
      itemsHeader: {
        message: 'Items',
      },
      sizeHeader: {
        message: 'Size',
      },
    },
  };

</script>
