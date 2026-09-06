<script lang="ts" setup>
import { foilDeckColor } from "~/constants/foilCardColor";

const props = defineProps<{
    model: string;
    foilDeck?: keyof typeof foilDeckColor;
}>();
</script>

<template>
    <TCardsModel
        model="/cards/cards.glb"
        :foilColor="
            props.foilDeck ? foilDeckColor[props.foilDeck].foilColor : undefined
        "
        :paperColor="
            props.foilDeck
                ? foilDeckColor[props.foilDeck].paperColor
                : undefined
        "
        :front_mask="`/${model}-texture/card_front_mask.png`"
        :back_mask_and_metalnessMap="`/${model}-texture/card_back_mask_metallic.png`"
        :back_roughnessMap="`/${model}-texture/card_back_roughness.png`"
        :back_fill_mask="`/${model}-texture/card_back_fill_mask.png`"
        :back_normalMap="`/${model}-texture/card_back_normal.png`"
    />
</template>

<style scoped></style>
