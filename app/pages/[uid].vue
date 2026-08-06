<script setup lang="ts">
import { components } from "~/slices";

const prismic = usePrismic();
const route = useRoute();
const { data: page } = await useAsyncData(route.params.uid as string, () =>
    prismic.client.getByUID("page", route.params.uid as string),
);

useSeoMeta({
    title: page.value?.data.meta_title ?? undefined,
    ogTitle: page.value?.data.meta_title ?? undefined,
    description: page.value?.data.meta_description ?? undefined,
    ogDescription: page.value?.data.meta_description ?? undefined,
    ogImage: page.value?.data.meta_image.url,
});
</script>

<template>
    <main>
        <SliceZone :slices="page?.data.slices ?? []" :components="components" />
    </main>
</template>
