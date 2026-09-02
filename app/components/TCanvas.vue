<script lang="ts" setup>
import { ACESFilmicToneMapping, SRGBColorSpace, Vector3 } from "three";

const mounted = ref(false);

const cameraPosition = new Vector3(0, 0, 20);

onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <figure class="threeD-canvas__wrapper" :class="{ 'opacity-0': !mounted }">
        <TresCanvas
            shadows
            :output-color-space="SRGBColorSpace"
            :tone-mapping="ACESFilmicToneMapping"
            :tone-mapping-exposure="2"
        >
            <OrbitControls />

            <TresPerspectiveCamera
                :fov="45"
                :position="cameraPosition"
                :look-at="[0, 0, 0]"
            />

            <slot />
        </TresCanvas>
    </figure>
</template>

<style scoped>
.threeD-canvas__wrapper {
    transition: opacity 1s ease-in-out;
    transition-delay: 300ms;
}
</style>
