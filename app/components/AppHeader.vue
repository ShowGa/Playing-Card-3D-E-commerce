<script lang="ts" setup>
import type { Content } from "@prismicio/client";
import BrandIcon from "./svg/BrandIcon.vue";

const props = defineProps<{ settings?: Content.SettingsDocument }>();

const { totalItem } = useCart();
</script>

<template>
    <header>
        <nav class="header__nav">
            <div class="header__brand">
                <NuxtLink class="cta header__logo"><BrandIcon /></NuxtLink>

                <span class="header__tagline"
                    >ShowGa - The world's finest playing card design Co.</span
                >
            </div>

            <ul class="header__menu">
                <li
                    class="header__menu-item"
                    v-for="link in settings?.data.navigation"
                >
                    <PrismicLink class="cta" :field="link" />
                </li>

                <li class="header__menu-cart">
                    <NuxtLink to="/#cart" class="cta">
                        Cart (<ClientOnly fallback="~">
                            {{ totalItem }} </ClientOnly
                        >)
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
a {
    transition: opacity 300ms ease-in-out;
}

header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
}
header:has(a:hover) a:not(:hover) {
    opacity: 0.25;
}

.header__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    backdrop-filter: blur(4px);
}
.header__nav .cta {
    padding: 0;
}

.header__brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

.header__logo {
    height: 2.5rem;
    aspect-ratio: 822 / 947;
}

.header__tagline {
    display: none;
}

.header__menu {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 1rem;
}
.header__menu-cart {
    margin-left: auto;
}
.header__menu-item {
    display: none;
}

@media (min-width: 1280px) {
    .header__nav {
        padding-left: 5rem;
        padding-right: 5rem;
        padding-top: 1rem;
    }

    .header__menu {
        width: calc(40% + 2rem);
    }

    .header__logo {
        height: 3.75rem;
        aspect-ratio: 822 / 947;
    }

    .header__menu-item {
        display: block;
    }

    .header__tagline {
        display: block;
    }
}
</style>
