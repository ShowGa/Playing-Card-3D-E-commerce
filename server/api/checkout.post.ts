import stripe from "../utils/stripe-api";

export default defineEventHandler(async (event) => {
    const indexUrl = getRequestURL(event).origin;

    // read the body
    const body = await readBody<Record<string, string>>(event);

    // check the items
    const items = Object.entries(body)
        // object => [[key, value]]
        .map(([priceId, quantity]) => ({
            price: priceId,
            quantity: parseInt(quantity),
        }))
        .filter((item) => item.quantity > 0);

    if (items.length <= 0) return sendRedirect(event, indexUrl);

    // create checkout session
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: items,
        success_url: `${indexUrl}/thanks?order=completed`,
        cancel_url: `${indexUrl}/#cart`,
    });

    if (!session.url)
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to create checkout session !",
        });

    // redirect to the stripe checkout session
    return sendRedirect(event, session.url);
});
