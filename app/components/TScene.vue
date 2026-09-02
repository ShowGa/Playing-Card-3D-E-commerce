<script lang="ts" setup>
// vueuse
const { width } = useWindowSize();

const options = computed(() => {
    if (width.value >= 1280) {
        return {
            x: 0.33,
            cardPos: [1.7, 2.5, -2],
            casePos: [-1.7, -2.5, 0],
            scale: 0.7,
        };
    }

    return {
        x: 0.5,
        cardPos: [2.5, 4.5, 0],
        casePos: [-2.5, -5, 0],
        scale: 0.45,
    };
});
</script>

<template>
    <TAbsoluteGroup :x="options.x" :distance="20">
        <!-- Deck Cards -->
        <TresGroup :position="options.cardPos" :scale="options.scale">
            <Levioso>
                <TresGroup>
                    <TresGroup>
                        <TCards
                            model="aurelia"
                            :rotation="[Math.PI / 2, 0, 0]"
                        />
                    </TresGroup>
                </TresGroup>
            </Levioso>
        </TresGroup>

        <!-- Deck Box -->
        <TresGroup :position="options.casePos" :scale="options.scale">
            <Levioso>
                <TresGroup>
                    <TresGroup>
                        <TCase
                            model="aurelia"
                            :rotation="[-Math.PI / 2, 0, 0]"
                        />
                    </TresGroup>
                </TresGroup>
            </Levioso>
        </TresGroup>
    </TAbsoluteGroup>

    <TresMesh receive-shadow :position="[0, 0, -4]">
        <TresPlaneGeometry :args="[400, 400, 10, 10]" />
        <TresMeshStandardMaterial
            color="#ffffff"
            :roughness="0.5"
            :metalness="0.5"
        />
    </TresMesh>

    <TresDirectionalLight
        cast-shadow
        :position="[-8, 0, 20]"
        :intensity="0.5"
        :shadow-mapSize-width="1024"
        :shadow-mapSize-height="1024"
        :shadow-camera-near="1"
        :shadow-camera-far="50"
        :shadow-camera-left="-16"
        :shadow-camera-right="16"
        :shadow-camera-top="16"
        :shadow-camera-bottom="-16"
        :color="0xffffff"
    />

    <Suspense>
        <Environment files="/textures/lobby.hdr" :environment-intensity="0.5" />
    </Suspense>
</template>

<style scoped></style>

<!-- 

======= What does this file do ? ========
1. Control how 3D model animation works
2. Seperate layer of the 3D model with <TresGroup>, control different animation , avoid the conflict
3. 


        <TresGroup>
            <Levioso>
                <TresGroup>
                    <TresGroup>
                        <TCards />
                    </TresGroup>
                </TresGroup>
            </Levioso>
        </TresGroup>
-->
