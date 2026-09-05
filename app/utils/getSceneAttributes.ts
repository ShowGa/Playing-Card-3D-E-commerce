type GetSceneAttributesReturnType = {
    "data-scene-position"?: "top" | "center";
    "data-scene-model"?: string;
    "data-scene-rotate"?: boolean;
};

export function getSceneAttributes(params?: {
    model?: string;
    position?: "top" | "center";
    rotate?: boolean;
}): GetSceneAttributesReturnType {
    return {
        "data-scene-model": params?.model,
        "data-scene-position": params?.position,
        "data-scene-rotate": params?.rotate,
    };
}
