<template>

  <KGrid>
    <KGridItem :layout8="{ span: 4 }" :layout12="{ span: 6 }">
      <h1>{{ title }}</h1>
      <slot name="subtitle"></slot>
    </KGridItem>
    <KGridItem
      :layout="{ alignment: 'right' }"
      :layout8="{ span: 4 }"
      :layout12="{ span: 6 }"
      :style="{ margin: 'auto' }"
    >
      <slot name="actions"></slot>
    </KGridItem>
  </KGrid>

</template>


<script>

  export default {
    name: 'EditorPageHeader',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
  };

</script>
