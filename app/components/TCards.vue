<script lang="ts" setup>
defineProps<{ model: string }>();
</script>

<template>
    <TCardsModel
        model="/cards/cards.glb"
        :front_mask="`/${model}-texture/card_front_mask.png`"
        :back_mask_and_metalnessMap="`/${model}-texture/card_back_mask_metallic.png`"
        :back_roughnessMap="`/${model}-texture/card_back_roughness.png`"
        :back_fill_mask="`/${model}-texture/card_back_fill_mask.png`"
    />
</template>

<style scoped></style>
