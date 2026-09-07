<script lang="ts" setup>
import { Mesh, MeshStandardMaterial, NoColorSpace, Color } from "three";

const props = defineProps<{
    model: string;
    foilColor?: string;
    paperColor?: string;
    front_mask: string;
    back_mask_and_metalnessMap: string;
    back_roughnessMap: string;
    back_fill_mask: string;
    back_normalMap: string;
    // mask
}>();

const { state } = useGLTF(props.model);

const foilColor = new Color("#e7c072");
const paperColor = new Color("#fcfcfc");

const INK_COLOR_BLACK = "#0d0d0d";
const INK_COLOR_RED = "#dd0005";

const SUIT_INK_GROUP: Record<string, "black" | "red"> = {
    clubs: "black",
    spades: "black",
    heart: "red",
    diamond: "red",
};

function getInkColorGroup(meshName: string): "black" | "red" {
    const normalized = meshName.toLowerCase();
    const suitKey = normalized.split("_").pop() ?? "";

    const group = SUIT_INK_GROUP[suitKey];

    if (!group) {
        console.warn(
            `[TCards] Unable to identify the suit for mesh "${meshName}", defaulting to black.`,
        );
        return "black";
    }

    return group;
}

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

const { state: backNormal, isLoading: isBackNormalLoading } = useTexture(
    computed(() => props.back_normalMap),
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

function createFrontMaterial(
    frontMaskTexture: NonNullable<typeof frontMask.value>,
    inkColorHex: string,
) {
    const mat = new MeshStandardMaterial({
        map: frontMaskTexture,
        roughness: 0.62,
        metalness: 0,
    });

    mat.onBeforeCompile = (shader) => {
        shader.uniforms.uFrontMask = { value: frontMaskTexture };
        shader.uniforms.uInkColor = { value: new Color(inkColorHex) };

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
        uniform vec3 uInkColor;

        varying vec2 vFrontMaskUv;
        `,
            )
            .replace(
                "#include <color_fragment>",
                `
            #include <color_fragment>

            float maskValueFactor = texture(uFrontMask, vFrontMaskUv).r;
            vec3 cardColor = vec3(1.0, 1.0, 1.0);
            vec3 inkColor = uInkColor;

            diffuseColor.rgb = mix(cardColor, inkColor, maskValueFactor);
            `,
            );
    };

    return mat;
}

const material = computed(() => {
    if (
        !backMetalnessMap.value ||
        !backRoughnessMap.value ||
        !frontMask.value ||
        !backFillMask.value ||
        !backNormal.value ||
        isBackMetalnessMapLoading.value ||
        isBackRoughnessMapLoading.value ||
        isFrontMaskLoading.value ||
        isBackFillMaskLoading.value ||
        isBackNormalLoading.value
    ) {
        return;
    }

    [
        backMetalnessMap.value,
        backRoughnessMap.value,
        frontMask.value,
        backFillMask.value,
        backNormal.value,
    ].forEach((texture) => {
        if (texture) {
            texture.flipY = false;
            texture.colorSpace = NoColorSpace;
            texture.anisotropy = 16;
        }
    });

    // 黑色花色 (clubs, spades) 與紅色花色 (heart, diamond) 各自一顆材質
    const frontMatBlack = createFrontMaterial(frontMask.value, INK_COLOR_BLACK);
    const frontMatRed = createFrontMaterial(frontMask.value, INK_COLOR_RED);

    const backMat = new MeshStandardMaterial({
        roughness: 1,
        metalness: 1,
        roughnessMap: backRoughnessMap.value,
        metalnessMap: backMetalnessMap.value,
        normalMap: backNormal.value,
    });

    const sideMat = new MeshStandardMaterial({
        color: "#f2f2f2",
    });

    backMat.onBeforeCompile = (shader) => {
        shader.uniforms.uBackMetalnessMap = { value: backMetalnessMap.value };
        shader.uniforms.uBackFillMask = { value: backFillMask.value };

        shader.uniforms.uFoilColor = {
            value: foilColor,
        };

        shader.uniforms.uPaperColor = { value: paperColor };

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
        uniform vec3 uFoilColor;
        uniform vec3 uPaperColor;

        varying vec2 vBackUv;
        `,
            )
            .replace(
                "#include <color_fragment>",
                `
            #include <color_fragment>

            float maskValueFactor = texture(uBackMetalnessMap, vBackUv).r;
            float fillMaskValueFactor = texture(uBackFillMask, vBackUv).r;

            vec3 foilColor = uFoilColor;
            vec3 fillColor = mix(uPaperColor, vec3(1.0, 1.0, 1.0), fillMaskValueFactor);

            diffuseColor.rgb = mix(fillColor, foilColor, maskValueFactor);
            `,
            );

        return;
    };

    return {
        frontBlack: frontMatBlack,
        frontRed: frontMatRed,
        back: backMat,
        side: sideMat,
    };
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
                    const inkGroup = getInkColorGroup(name);
                    child.material =
                        inkGroup === "red"
                            ? material.frontRed
                            : material.frontBlack;
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
