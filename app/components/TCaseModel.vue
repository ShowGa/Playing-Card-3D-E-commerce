<script lang="ts" setup>
import { Color, Mesh, MeshStandardMaterial, NoColorSpace } from "three";

const props = defineProps<{
    model: string;
    foilColor?: string;
    paperColor?: string;
    mask_and_metalnessMap: string;
    roughnessMap: string;
    normalMap: string;
}>();

const { state } = useGLTF(props.model);

const foilColor = new Color("#e7c072");
const paperColor = new Color("#fcfcfc");

const { state: metalnessMap, isLoading: isMetalnessMapLoading } = useTexture(
    computed(() => props.mask_and_metalnessMap),
);

const { state: roughnessMap, isLoading: isRoughnessMapLoading } = useTexture(
    computed(() => props.roughnessMap),
);

const { state: normalMap, isLoading: isNormalMapLoading } = useTexture(
    computed(() => props.normalMap),
);

watch(
    () => props.foilColor,
    (value) => {
        foilColor.set(value ?? "#e7c072");
    },
    {
        immediate: true,
    },
);
watch(
    () => props.paperColor,
    (value) => {
        paperColor.set(value ?? "#fcfcfc");
    },
    {
        immediate: true,
    },
);

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
            texture.flipY = false;
            texture.colorSpace = NoColorSpace;
            texture.anisotropy = 16;
        },
    );

    const mat = new MeshStandardMaterial({
        roughness: 1,
        metalness: 1,
        metalnessMap: metalnessMap.value,
        roughnessMap: roughnessMap.value,
        normalMap: normalMap.value,
    });

    mat.onBeforeCompile = (shader) => {
        shader.uniforms.uMask = {
            value: metalnessMap.value,
        };

        shader.uniforms.uFoilColor = {
            value: foilColor,
        };

        shader.uniforms.uPaperColor = { value: paperColor };

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
                    uniform vec3 uFoilColor;
                    uniform vec3 uPaperColor;

                    varying vec2 vMaskUv;
                `,
            )
            .replace(
                "#include <color_fragment>",
                `
                    #include <color_fragment>

                    float maskValueFactor = texture(
                        uMask,
                        vMaskUv
                    ).r;

                    vec3 caseColor = uPaperColor;
                    vec3 foilColor = uFoilColor;

                    diffuseColor.rgb = mix(
                        caseColor,
                        foilColor,
                        maskValueFactor
                    );
                `,
            );
    };

    return mat;
});

watch(
    [state, material],
    ([state, material]) => {
        if (!state?.scene || !material) return;

        state.scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.material = material;
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
