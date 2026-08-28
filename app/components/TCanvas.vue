<script lang="ts" setup>
import { ref } from "vue";
</script>

<template>
    <figure>
        <TresCanvas>
            <TresPerspectiveCamera />

            <slot />
        </TresCanvas>
    </figure>
</template>

<style scoped></style>
