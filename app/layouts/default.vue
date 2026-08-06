<script lang="ts" setup>
const route = useRoute();
const prismic = usePrismic();
const { data: settings } = await useAsyncData("settings", () => {
    return prismic.client.getSingle("settings");
});

useSeoMeta({
    title: settings.value?.data.site_title,
    ogTitle: settings.value?.data.site_title,
    description: settings.value?.data.meta_description,
    ogDescription: settings.value?.data.meta_description,
    ogImage: settings.value?.data.meta_image.url,
});
</script>

<template>
    <div>
        <AppHeader :settings="settings" />

        <div></div>

        <slot />

        <AppFooter :settings="settings" />
    </div>
</template>

<style scoped></style>
