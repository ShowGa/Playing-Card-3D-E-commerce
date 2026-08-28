<script lang="ts" setup></script>

<template>
    <TAbsoluteGroup>
        <!-- Deck Box -->
        <TresGroup>
            <Levioso>
                <TresGroup>
                    <TresGroup>
                        <TDeckBox />
                    </TresGroup>
                </TresGroup>
            </Levioso>
        </TresGroup>

        <!-- Deck Cards -->
        <TresGroup>
            <Levioso>
                <TresGroup>
                    <TresGroup></TresGroup>
                </TresGroup>
            </Levioso>
        </TresGroup>
    </TAbsoluteGroup>

    <TresMesh>
        <TresPlaneGeometry :args="[400, 400, 10, 10]" />
        <TresMeshStandardMaterial
            color="#ffffff"
            :roughness="0.5"
            :metalness="0.5"
        />
    </TresMesh>

    <TresDirectionalLight
        cast-shadow
        :intensity="0.2"
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
        <Environment :environment-intensity="0.8" />
    </Suspense>
</template>

<style scoped></style>

<!-- 

======= What does this file do ? ========
1. Control how 3D model animation works
2. Seperate layer of the 3D model with <TresGroup>, control different animation , avoid the conflict
3. 



-->
