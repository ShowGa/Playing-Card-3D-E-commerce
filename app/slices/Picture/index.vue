<script setup lang="ts">
import type { Content } from "@prismicio/client";
import SlideIn from "~/components/SlideIn.vue";
import { getSceneAttributes } from "~/utils/getSceneAttributes";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
    getSliceComponentProps<Content.PictureSlice>([
        "slice",
        "index",
        "slices",
        "context",
    ]),
);
</script>

<template>
    <section
        v-bind="
            getSceneAttributes({
                position: 'top',
                model: $prismic.isFilled.contentRelationship(
                    slice.primary.product,
                )
                    ? slice.primary.product.uid
                    : undefined,
            })
        "
        class="gallery-section"
        :class="`gallery-section--${slice.variation}`"
        :data-slice-type="slice.slice_type"
        :data-slice-variation="slice.variation"
    >
        <figure class="gallery-section__main">
            <PrismicImage
                :field="slice.primary.picture"
                class="gallery-section__image gallery-section__image--main"
                loading="lazy"
            />

            <SlideIn
                as="figcaption"
                class="gallery-section__caption gallery-section__caption--main rich-text"
            >
                <PrismicRichText :field="slice.primary.caption" />
            </SlideIn>
        </figure>

        <figure
            v-if="$prismic.isFilled.image(slice.primary.secondary_picture)"
            class="gallery-section__secondary"
        >
            <PrismicImage
                :field="slice.primary.secondary_picture"
                class="gallery-section__image"
                loading="lazy"
            />

            <SlideIn
                as="figcaption"
                class="gallery-section__caption gallery-section__caption--secondary rich-text"
            >
                <PrismicRichText :field="slice.primary.secondary_caption" />
            </SlideIn>
        </figure>
    </section>
</template>

<style scoped>
.gallery-section {
    display: grid;
}

@media (min-width: 1280px) {
    .gallery-section {
        grid-template-columns: 3fr 2fr;
    }
}

/* ---------- Elements ---------- */

.gallery-section__main {
    display: contents;
}

.gallery-section__secondary {
    display: flex;
    flex-direction: column;
}

.gallery-section__image {
    width: 100%;
    height: auto;
    z-index: 20;
}

.gallery-section__image--main {
    grid-row: span 2;
}

/* 共用樣式：只放跟定位無關的部分 */
.gallery-section__caption {
    padding: 1rem 1rem 4rem;
}

/* ---------- default ---------- */

@media (min-width: 1280px) {
    .gallery-section--default .gallery-section__caption--main {
        align-self: flex-start;
    }

    .gallery-section--default .gallery-section__secondary {
        align-self: flex-end;
    }
}

/* ---------- bottom ---------- */

@media (min-width: 1280px) {
    .gallery-section--bottom .gallery-section__caption--main {
        align-self: flex-start;
    }

    .gallery-section--bottom .gallery-section__secondary {
        align-self: flex-end;
    }

    .gallery-section--bottom .gallery-section__caption--secondary {
        order: -1;
    }
}

/* ---------- top ---------- */

@media (min-width: 1280px) {
    .gallery-section--top .gallery-section__caption--main {
        order: 1;
        align-self: flex-end;
    }

    .gallery-section--top .gallery-section__secondary {
        align-self: flex-start;
    }
}
</style>
