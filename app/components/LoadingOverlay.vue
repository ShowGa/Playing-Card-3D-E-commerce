<script lang="ts" setup>
const isReady = defineModel<boolean>("isReady", {
    default: false,
});

const { progress } = await useProgress();

const hasStarted = ref(false); // prevent setTimout been call by multiple times

watch(progress, (value) => {
    if (value >= 100 && !hasStarted.value) {
        hasStarted.value = true;

        setTimeout(() => {
            isReady.value = true;
        }, 2000);
    }
});
</script>

<template>
    <div v-if="!isReady" class="loading">
        <p class="loading__text">Loading {{ Math.floor(progress) }} %</p>

        <div class="loading__progress">
            <div
                class="loading__progress-bar"
                :style="{ width: `${progress}%` }"
            />
        </div>
    </div>
</template>

<style scoped>
.loading {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: black;
    font-weight: 300;
}

.loading__text {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
    letter-spacing: 0.1em;
    animation: loading-pulse 2s ease-in-out infinite;
}

.loading__progress {
    position: relative;
    width: 15rem;
    height: 0.25rem;
    overflow: hidden;
    border-radius: 9999px;
    background-color: rgb(255 255 255 / 20%);
}

.loading__progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: white;
    transition: width 300ms ease;
}

@keyframes loading-pulse {
    50% {
        opacity: 0.5;
    }
}
</style>
