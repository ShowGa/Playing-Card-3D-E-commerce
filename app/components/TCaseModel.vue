<script lang="ts" setup>
import { Mesh, MeshStandardMaterial, NoColorSpace } from "three";

const props = defineProps<{
    model: string;
    mask_and_metalnessMap: string;
    roughnessMap: string;
    normalMap: string;
}>();

const { state } = useGLTF(props.model);

// load maps
const { state: metalnessMap, isLoading: isMetalnessMapLoading } = useTexture(
    computed(() => props.mask_and_metalnessMap),
);

const { state: roughnessMap, isLoading: isRoughnessMapLoading } = useTexture(
    computed(() => props.roughnessMap),
);

const { state: normalMap, isLoading: isNormalMapLoading } = useTexture(
    computed(() => props.normalMap),
);

// compute the material
const material = computed(() => {
    if (
        !metalnessMap.value ||
        !roughnessMap.value ||
        !normalMap.value ||
        isNormalMapLoading.value ||
        isMetalnessMapLoading.value ||
        isRoughnessMapLoading.value
    ) {
        return;
    }

    [normalMap.value, metalnessMap.value, roughnessMap.value].forEach(
        (texture) => {
            if (texture) {
                texture.flipY = false;
                texture.colorSpace = NoColorSpace;
                texture.anisotropy = 16;
            }
        },
    );

    const mat = new MeshStandardMaterial({
        // color: 0xffffff,
        roughness: 1,
        metalness: 1,

        metalnessMap: metalnessMap.value,
        roughnessMap: roughnessMap.value,
        normalMap: normalMap.value,
    });

    mat.onBeforeCompile = (shader) => {
        shader.uniforms.uMask = { value: metalnessMap.value };

        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `
            #include <common>

            varying vec2 vMaskUv;
            `,
        );

        shader.vertexShader = shader.vertexShader.replace(
            "#include <uv_vertex>",
            `
                #include <uv_vertex>

                vMaskUv = uv;
                `,
        );

        shader.fragmentShader = shader.fragmentShader
            .replace(
                "#include <common>",
                `
                #include <common>

                uniform sampler2D uMask;
                varying vec2 vMaskUv;
                `,
            )
            .replace(
                "#include <color_fragment>",
                `
            #include <color_fragment>

            float maskValueFactor = texture(uMask, vMaskUv).r;
            vec3 caseColor = vec3(0.0, 0.0, 0.0);
            vec3 foilColor = vec3(0.71, 0.494, 0.196);

            diffuseColor.rgb = mix(caseColor, foilColor, maskValueFactor);
            `,
            );
    };

    return mat;
});

// apply material to GLTF meshes
watch(
    [state, material],
    ([state, material]) => {
        if (!state?.scene || !material) return;

        state.scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.material = material;

                console.log(child.name, child.geometry.attributes.uv);
            }
        });
    },
    { immediate: true },
);
</script>

<template>
    <primitive
        v-if="state?.scene"
        :object="state.scene"
        :scale="100"
        v-bind="$attrs"
    />
</template>

<style scoped></style>

<!-- vec3 foilColor = vec3(0.71, 0.494, 0.196); -->
