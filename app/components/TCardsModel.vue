<script lang="ts" setup>
import { Mesh, MeshStandardMaterial, NoColorSpace } from "three";

const props = defineProps<{
    model: string;
    front_mask: string;
    back_mask_and_metalnessMap: string;
    back_roughnessMap: string;
    back_fill_mask: string;
    // mask
}>();

const { state } = useGLTF(props.model);
console.log(state.value?.animations);

watch(state, (state) => {
    state?.scene.traverse((child) => {
        if (child instanceof Mesh) {
            child.castShadow = true;
        }
    });

    console.log(state?.scene);
});

// load maps
const { state: backMetalnessMap, isLoading: isBackMetalnessMapLoading } =
    useTexture(computed(() => props.back_mask_and_metalnessMap));

const { state: backRoughnessMap, isLoading: isBackRoughnessMapLoading } =
    useTexture(computed(() => props.back_roughnessMap));

const { state: frontMask, isLoading: isFrontMaskLoading } = useTexture(
    computed(() => props.front_mask),
);

const { state: backFillMask, isLoading: isBackFillMaskLoading } = useTexture(
    computed(() => props.back_fill_mask),
);

const material = computed(() => {
    if (
        !backMetalnessMap.value ||
        !backRoughnessMap.value ||
        !frontMask.value ||
        !backFillMask.value ||
        isBackMetalnessMapLoading.value ||
        isBackRoughnessMapLoading.value ||
        isFrontMaskLoading.value ||
        isBackFillMaskLoading.value
    ) {
        return;
    }

    [
        backMetalnessMap.value,
        backRoughnessMap.value,
        frontMask.value,
        backFillMask.value,
    ].forEach((texture) => {
        if (texture) {
            texture.flipY = false;
            texture.colorSpace = NoColorSpace;
            texture.anisotropy = 16;
        }
    });

    const frontMat = new MeshStandardMaterial({
        map: frontMask.value,
        roughness: 0.62,
        metalness: 0,
    });

    const backMat = new MeshStandardMaterial({
        roughness: 1,
        metalness: 1,
        roughnessMap: backRoughnessMap.value,
        metalnessMap: backMetalnessMap.value,
    });

    const sideMat = new MeshStandardMaterial({
        color: "#ffffff",
    });

    // onBeforeCompile
    frontMat.onBeforeCompile = (shader) => {
        shader.uniforms.uFrontMask = { value: frontMask.value };

        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `
            #include <common>
            varying vec2 vFrontMaskUv;
            `,
        );

        shader.vertexShader = shader.vertexShader.replace(
            "#include <uv_vertex>",
            `
            #include <uv_vertex>
            vFrontMaskUv = uv;
            `,
        );

        shader.fragmentShader = shader.fragmentShader
            .replace(
                "#include <common>",
                `
        #include <common>

        uniform sampler2D uFrontMask;
        varying vec2 vFrontMaskUv;
        `,
            )
            .replace(
                "#include <color_fragment>",
                `
            #include <color_fragment>

            float maskValueFactor = texture(uFrontMask, vFrontMaskUv).r;
            vec3 cardColor = vec3(1.0, 1.0, 1.0);
            vec3 inkColor = vec3(0.0, 0.0, 0.0);

            diffuseColor.rgb = mix(cardColor, inkColor, maskValueFactor);
            `,
            );
    };

    backMat.onBeforeCompile = (shader) => {
        shader.uniforms.uBackMetalnessMap = { value: backMetalnessMap.value };
        shader.uniforms.uBackFillMask = { value: backFillMask.value };

        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `
            #include <common>
            varying vec2 vBackUv;
            `,
        );

        shader.vertexShader = shader.vertexShader.replace(
            "#include <uv_vertex>",
            `
            #include <uv_vertex>
            vBackUv = uv;
            `,
        );

        shader.fragmentShader = shader.fragmentShader
            .replace(
                "#include <common>",
                `
        #include <common>

        uniform sampler2D uBackMetalnessMap;
        uniform sampler2D uBackFillMask;
        varying vec2 vBackUv;
        `,
            )
            .replace(
                "#include <color_fragment>",
                `
            #include <color_fragment>

            float maskValueFactor = texture(uBackMetalnessMap, vBackUv).r;
            float fillMaskValueFactor = texture(uBackFillMask, vBackUv).r;

            vec3 foilColor = vec3(0.71, 0.494, 0.196);
            vec3 fillColor = mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), fillMaskValueFactor);

            diffuseColor.rgb = mix(fillColor, foilColor, maskValueFactor);
            `,
            );

        return;
    };

    return { front: frontMat, back: backMat, side: sideMat };
});

watch(
    [state, material],
    ([state, material]) => {
        if (!state?.scene || !material) return;

        state.scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                const name = child.name.toLowerCase();

                if (name.includes("front")) {
                    child.material = material.front;
                } else if (name.includes("back")) {
                    child.material = material.back;
                } else {
                    child.material = material.side;
                }
            }
        });
    },
    { immediate: true },
);

// watch material change and color change
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
