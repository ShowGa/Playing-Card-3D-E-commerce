<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSceneAttributes } from "~/utils/getSceneAttributes";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
    getSliceComponentProps<Content.CartSlice>([
        "slice",
        "index",
        "slices",
        "context",
    ]),
);

const { items, totalPrice, removeItem } = useCart();
</script>

<template>
    <SlideIn
        v-bind="
            getSceneAttributes({
                position: 'center',
                model: $prismic.isFilled.contentRelationship(
                    slice.primary.product,
                )
                    ? slice.primary.product.uid
                    : undefined,
            })
        "
        id="cart"
        as="form"
        method="post"
        action="/api/checkout"
        class="cart-section__form bounded rich-text"
    >
        <PrismicRichText :field="slice.primary.title" />

        <template v-if="Object.keys(items).length">
            <PrismicRichText :field="slice.primary.text" />

            <ul class="cart-list">
                <li
                    v-for="item in items"
                    :key="item.product.id"
                    class="cart-item"
                >
                    <span class="cart-item__name">
                        {{ item.name }}
                    </span>

                    <span
                        :aria-label="`Quantity of ${item.name}`"
                        class="cart-item__quantity"
                    >
                        {{ item.quantity }}
                    </span>

                    <span
                        :aria-label="`Price of ${item.name} ${item.quantity}`"
                        class="cart-item__price"
                    >
                        {{
                            formatPrice(
                                item.quantity * item.product.price.amount,
                            )
                        }}
                    </span>

                    <button
                        type="button"
                        title="Remove from cart"
                        class="cta cart-item__remove"
                        @click="removeItem(item.product.id)"
                    >
                        &times;
                    </button>

                    <input
                        type="hidden"
                        :name="item.product.price.id"
                        :value="item.quantity"
                    />
                </li>
            </ul>

            <hr class="cart-divider" />

            <p aria-label="Total Price" class="cart-total">
                {{ formatPrice(totalPrice) }}
            </p>

            <button class="cart-form__button cta cta--primary" type="submit">
                Checkout
            </button>
        </template>

        <PrismicRichText v-else :field="slice.primary.empty_text" />
    </SlideIn>
</template>

<style scoped>
.cart-section__form {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.cart-list {
    margin-top: 4rem;
    max-width: 40ch;
}

.cart-item {
    display: grid;
    grid-template-columns: minmax(0, 2.3fr) 0.7fr 1.5fr 3.125rem;
    align-items: center;
    margin-top: 0;
}

.cart-item__name {
    min-width: 0;
}

.cart-item__quantity,
.cart-item__price {
    text-align: right;
}

.cart-item__remove {
    width: 3.125rem;
    margin-right: -1rem;
}

.cart-divider {
    max-width: 40ch;
}

.cart-total {
    padding-right: 3.125rem;
    text-align: right;
}

.cart-form__button {
    font-size: 1rem;
    margin-top: 4rem;
    max-width: 40ch;
    width: 100%;
}
</style>
