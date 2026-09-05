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

            <ul :style="{ marginTop: '4rem', maxWidth: '40ch' }">
                <li
                    v-for="item in items"
                    :style="{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 0,
                    }"
                >
                    <span :style="{ flexGrow: 1 }">{{ item.name }}</span>
                    <span
                        :aria-label="`Quantity of ${item.name}`"
                        class="flex-1--text_align_rignt"
                        >{{ item.quantity }}</span
                    >
                    <span
                        :style="{ flexGrow: 1, textAlign: 'right' }"
                        :aria-label="`Price of ${item.name} ${item.quantity}`"
                        >{{
                            formatPrice(
                                item.quantity * item.product.price.amount,
                            )
                        }}</span
                    >

                    <button
                        class="cta"
                        :style="{ width: '3.125rem', marginRight: '-1rem' }"
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

            <hr :style="{ maxWidth: '40ch' }" />

            <p
                aria-label="Total Price"
                :style="{ paddingRight: '2.125rem', textAlign: 'right' }"
            >
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

.cart-form__button {
    font-size: 1rem;
    margin-top: 4rem;
    max-width: 40ch;
    width: 100%;
}

.flex-1--text_align_rignt {
    flex-grow: 1;
    text-align: right;
}
</style>
