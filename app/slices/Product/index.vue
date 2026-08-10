<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
    getSliceComponentProps<
        Content.ProductSlice,
        { stripeProducts: Record<string, StripeProduct> }
    >(["slice", "index", "slices", "context"]),
);

const prismic = usePrismic();

const product = computed(() => {
    const prismicProduct = props.slice.primary.product;

    if (
        !prismic.isFilled.contentRelationship(prismicProduct) ||
        !prismicProduct.data?.stripe_id
    ) {
        return undefined;
    }

    console.log(props.context.stripeProducts);
    console.log(prismicProduct.data.stripe_id);

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

    alert("Product Added to cart !");

    setQuantity(1);
}
</script>

<template>
    <SlideIn
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
                <p style="text-align: center">
                    <NuxtLink to="#/cart" class="cta cta--muted"
                        >1 in cart</NuxtLink
                    >
                </p>
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
