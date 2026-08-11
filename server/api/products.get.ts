import stripe from "../utils/stripe-api";

export default defineEventHandler(async (event) => {
    /**
     * Fetch product data from stipe
     * Format data
     * Return data
     *
     */

    const { data: products } = await stripe.products.list({
        active: true,
        expand: ["data.default_price"],
    });

    const productMap: Record<string, StripeProduct> = {};

    for (const product of products) {
        if (
            product.default_price &&
            typeof product.default_price === "object" &&
            product.default_price.unit_amount
        ) {
            productMap[product.id] = {
                id: product.id,
                price: {
                    id: product.default_price.id,
                    amount: product.default_price.unit_amount,
                },
            };
        }
    }

    return productMap;
});
