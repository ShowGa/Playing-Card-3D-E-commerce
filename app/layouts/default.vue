<script lang="ts" setup>
import TCanvas from "~/components/TCanvas.vue";

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

onMounted(() => {
    if (route.query.order === "completed") {
        useCart().clear();
        useRouter().replace({ path: route.path });
    }
});
</script>

<template>
    <div>
        <AppHeader :settings="settings" />

        <div></div>

        <slot />

        <AppFooter :settings="settings" />

        <TCanvas class="experience__3D-canvas">
            <TScene />
        </TCanvas>
    </div>
</template>

<style scoped>
.experience__3D-canvas {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 100lvh; /* fix the mobile shrink link / tool bar */
    z-index: -1;
}
</style>
