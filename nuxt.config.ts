// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: ["@nuxtjs/prismic", "@nuxt/fonts", "@vueuse/nuxt", "@tresjs/nuxt"],
    css: ["~/assets/css/main.css"],
    app: {
        head: {
            title: "ShowGa Playing Card",
            htmlAttrs: { lang: "en" },
            meta: [
                { charset: "utf-8" },
                {
                    name: "apple-mobile-web-app-title",
                    content: "ShowGa Playing Card",
                },
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: "" },
                { rel: "icon", type: "image/png", href: "", sizes: "96x96" },
                { rel: "icon", type: "image/svg+xml", href: "" },
                { rel: "apple-touch-icon", href: "", sizes: "180x180" },
                { rel: "manifest", href: "" },
            ],
        },
    },
    runtimeConfig: {
        stripeSecretKey: "",
    },
});