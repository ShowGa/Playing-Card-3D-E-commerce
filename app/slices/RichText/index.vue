<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
    getSliceComponentProps<Content.RichTextSlice>([
        "slice",
        "index",
        "slices",
        "context",
    ]),
);
</script>

<template>
    <SlideIn
        class="thanks-section bounded rich-text"
        :style="{
            minHeight: slice.variation !== 'fullScreen' ? '40vh' : '100vh',
            opacity: slice.variation === 'fullScreen' ? 0 : 1,
        }"
    >
        <PrismicRichText :field="slice.primary.title" wrapper="section" />
        <PrismicRichText :field="slice.primary.text" wrapper="section" />

        <div class="thanks-link__wrapper">
            <PrismicLink
                v-for="link in slice.primary.ctas"
                :key="link.key"
                :field="link"
                :class="`cta cta--${link.variant?.toLowerCase()}`"
            />
        </div>
    </SlideIn>
</template>

<style scoped>
.thanks-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.thanks-link__wrapper {
    display: flex;
    margin-top: 4rem;
    margin-left: -1rem;
}
</style>
