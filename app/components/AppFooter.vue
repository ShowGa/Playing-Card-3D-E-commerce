<script lang="ts" setup>
import type { Content } from "@prismicio/client";
import BrandIcon from "./svg/BrandIcon.vue";

defineProps<{ settings?: Content.SettingsDocument }>();
</script>

<template>
    <footer>
        <figure class="footer__logo-container">
            <BrandIcon class="footer__logo" fill="#f0f0f0" />
        </figure>

        <SlideIn class="bounded rich-text footer__links">
            <h2>ShowGa</h2>
            <PrismicRichText :field="settings?.data.footer_text" />
            <div :style="{ flexGrow: 1 }"></div>
            <PrismicRichText :field="settings?.data.footer_secondary_text" />
        </SlideIn>
    </footer>
</template>

<style scoped>
footer {
    position: relative;
    z-index: 20;
    color: #f0f0f0; /* var(--color-neutrals-100) */
    background-color: var(--color-neutrals-base_black);
}

.footer__logo-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

.footer__logo {
    /* position: sticky;
    top: 0;
    right: 0; */
    height: 100%;
    width: 100%;
}

.footer__links {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    mix-blend-mode: difference;
}

@media (min-width: 1280px) {
    .footer__logo {
        width: auto;
    }
}
</style>
