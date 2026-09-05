<script setup lang="ts">
import { asText, type Content } from "@prismicio/client";
import type { rotate } from "three/src/nodes/TSL.js";
import { getSceneAttributes } from "~/utils/getSceneAttributes";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
    getSliceComponentProps<
        Content.ProductSlice,
        { stripeProducts: Record<string, StripeProduct> }
    >(["slice", "index", "slices", "context"]),
);

const prismic = usePrismic();

const { items, upsertItem } = useCart();

const product = computed(() => {
    const prismicProduct = props.slice.primary.product;

    if (
        !prismic.isFilled.contentRelationship(prismicProduct) ||
        !prismicProduct.data?.stripe_id
    ) {
        return undefined;
    }

    const stripeProduct =
        props.context.stripeProducts[prismicProduct.data?.stripe_id];

    if (!stripeProduct) {
        return undefined;
    }

    return { ...prismicProduct, stripeProduct };
});

const quantity = ref(1);

// function
function setQuantity(value: number) {
    quantity.value = Math.max(1, value);
}

function onSubmit(event: Event) {
    event.preventDefault();

    if (!product.value) return;

    const currentCartQuantity =
        items.value[product.value.stripeProduct.id]?.quantity ?? 0;

    upsertItem({
        product: product.value?.stripeProduct,
        quantity: currentCartQuantity + quantity.value,
        name: asText(product.value.data?.name) ?? "",
    });

    setQuantity(1);
}
</script>

<template>
    <SlideIn
        v-bind="
            getSceneAttributes({
                position: 'center',
                model: product.uid,
                rotate: true,
            })
        "
        v-if="product"
        as="article"
        class="rich-text bounded product-section__wrapper"
    >
        <header class="rich-text product-section__header">
            <PrismicRichText :field="product?.data?.name" />
            <p aria-label="Price">
                {{ formatPrice(product.stripeProduct.price.amount) }} / Deck
            </p>
        </header>
        <section class="rich-text">
            <h3 class="screen-reader">Description</h3>
            <PrismicRichText :field="product?.data?.description" />
        </section>
        <form class="product-section__form" @submit="onSubmit">
            <div class="flex-center" style="flex-grow: 1">
                <button
                    class="cta"
                    type="button"
                    @click="setQuantity(quantity - 1)"
                >
                    -
                </button>
                <div style="flex-grow: 1; text-align: center">
                    {{ quantity }}
                </div>
                <button
                    class="cta"
                    type="button"
                    @click="setQuantity(quantity + 1)"
                >
                    +
                </button>
            </div>

            <div style="flex-grow: 1">
                <button class="cta cta--primary" style="width: 100%">
                    Add To Cart
                </button>

                <ClientOnly>
                    <p
                        style="text-align: center"
                        :style="{
                            visibility: items[product.stripeProduct.id]
                                ?.quantity
                                ? 'visible'
                                : 'hidden',
                        }"
                    >
                        <NuxtLink to="#/cart" class="cta cta--muted">
                            {{ items[product.stripeProduct.id]?.quantity }} in
                            cart
                        </NuxtLink>
                    </p>
                </ClientOnly>
            </div>
        </form>
    </SlideIn>
    <SlideIn
        v-else
        as="article"
        class="bounded rich-text product-section__wrapper"
    >
        <p>Product Not Found</p>
    </SlideIn>
</template>

<style scoped>
.product-section__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 150vh;
}

.product-section__header {
    padding-top: 25vh;
}

.product-section__form {
    display: flex;
    align-items: start;
    margin-top: 4rem;
    margin-left: -1rem;
    max-width: calc(40ch + 1rem);
    font-size: 0.875rem;
}
</style>

<!-- <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
>
        Placeholder component for {{ slice.slice_type }} (variation:
        {{ slice.variation }}) slices.
        <br />
        <strong>You can edit this slice directly in your code editor.</strong>
</section> -->
