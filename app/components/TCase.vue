<script lang="ts" setup>
defineProps<{ model: string }>();

// define the card foil data
const foilData: Record<string, number> = {};
</script>

<template>
    <TCaseModel
        model="/case/case.glb"
        :normalMap="`/${model}-texture/case_normal_1024.png`"
        :roughnessMap="`/${model}-texture/case_roughness.png`"
        :mask_and_metalnessMap="`/${model}-texture/case_mask_metallic.png`"
    />
</template>

<style scoped></style>
