<script lang="ts" setup>
import { foilDeckColor } from "~/constants/foilCardColor";

const props = defineProps<{
    model: string;
    foilDeck?: keyof typeof foilDeckColor;
}>();
</script>

<template>
    <TCaseModel
        model="/case/case.glb"
        :foilColor="
            props.foilDeck ? foilDeckColor[props.foilDeck].foilColor : undefined
        "
        :paperColor="
            props.foilDeck
                ? foilDeckColor[props.foilDeck].paperColor
                : undefined
        "
        :normalMap="`/${props.model}-texture/case_normal_1024.png`"
        :roughnessMap="`/${props.model}-texture/case_roughness.png`"
        :mask_and_metalnessMap="`/${props.model}-texture/case_mask_metallic.png`"
        v-bind="$attrs"
    />
</template>

<style scoped></style>
