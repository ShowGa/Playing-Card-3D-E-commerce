<script lang="ts" setup>
import gsap from "gsap";
import { useGSAP } from "~/composables/useGSAP";

defineProps<{ as?: string }>();

const $this = shallowRef<HTMLElement>();

useGSAP((isReducedMotion) => {
    if (!$this.value) return;

    gsap.set($this.value, { opacity: 1 });

    if (isReducedMotion) return;

    gsap.from($this.value.children, {
        y: 50,
        delay: 0.3,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        opacity: 0,
        scrollTrigger: {
            trigger: $this.value,
            start: "top bottom-=25%",
        },
    });
});
</script>

<template>
    <component :is="as || 'section'" ref="$this"><slot /></component>
</template>

<style scoped></style>
