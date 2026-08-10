import Stripe from "stripe";

const stripe = new Stripe(useRuntimeConfig().stripeSecretKey);

export default stripe;
