<script lang="ts" setup>
import type { Group } from "three";
import gsap from "gsap";
import type { foilDeckColor } from "~/constants/foilCardColor";

const { totalItem } = useCart();
const route = useRoute();

const activeCustomColor = ref("golden-black" as keyof typeof foilDeckColor);

const cardRef = ref<Group | null>();
const cardInternalRef = ref<Group | null>();
const caseRef = ref<Group | null>();
const caseInternalRef = ref<Group | null>();

// vueuse
const { width } = useWindowSize();

// 3D model default animations
useLoop().onBeforeRender(({ elapsed }) => {
    const rotationRadian =
        Math.PI / 4 - (Math.sin(elapsed * 0.25) * Math.PI) / 2;

    if (cardInternalRef.value) {
        cardInternalRef.value.rotation.y = rotationRadian;
    }
    if (caseInternalRef.value) {
        caseInternalRef.value.rotation.y = rotationRadian;
    }
});

const options = computed(() => {
    if (width.value >= 1280) {
        return {
            x: 0.33,
            cardPos: [2.8, 1.5, 0],
            casePos: [-2.4, -3.5, 0],
            scale: 0.65,
        };
    }

    return {
        x: 0.5,
        cardPos: [2.5, 4.5, 0],
        casePos: [-2.5, -5, 0],
        scale: 0.45,
    };
});

useGSAP((isReducedMotion) => {
    if (!cardRef.value || !caseRef.value) return;

    const cardPos = cardRef.value.position;
    const casePos = caseRef.value.position;

    const cardRot = cardRef.value.rotation;
    const caseRot = caseRef.value.rotation;

    function animateScroll() {
        const $section = document.querySelectorAll<HTMLElement>(
            "[data-scene-position]",
        );

        $section.forEach((sec) => {
            const model = sec.dataset.sceneModel;
            const position = sec.dataset.scenePosition;
            const shouldRotate =
                !isReducedMotion && Boolean(sec.dataset.sceneRotate);

            function onEnterAndBack() {
                if (model) {
                    activeCustomColor.value =
                        model as keyof typeof foilDeckColor;
                }
            }

            function onRefresh(self: ScrollTrigger) {
                if (self.isActive && model) {
                    activeCustomColor.value =
                        model as keyof typeof foilDeckColor;
                }
            }

            if (position === "center" || position === "top") {
                gsap.to([cardPos, casePos], {
                    y: position === "center" ? 0 : 24,
                    // duration: 1,
                    stagger: 0.5,
                    ease: "power2.inOut",
                    repeatRefresh: true,
                    scrollTrigger: {
                        trigger: sec,
                        start:
                            position === "center"
                                ? "top+=40% bottom"
                                : "top bottom",
                        end:
                            position === "center"
                                ? "top+=90% bottom"
                                : "top+=50% bottom",
                        scrub: true,
                        invalidateOnRefresh: true,
                        onRefresh: onRefresh,
                        onEnter: onEnterAndBack,
                        onEnterBack: onEnterAndBack,
                    },
                });
            }

            // gsap animation for 3D object rotation
            if (shouldRotate) {
                gsap.to([cardRot, caseRot], {
                    y: `+=${Math.PI * 2}`,
                    // duration: 1,
                    ease: "power2.inOut",
                    stagger: 0.05,
                    repeatRefresh: true,
                    scrollTrigger: {
                        trigger: sec,
                        start: "top center",
                        end: "bottom center",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });
            }
        });
    }

    // animation => initial 3D object loaded
    if (!isReducedMotion || window.scrollY < 20) {
        gsap.fromTo(
            [cardPos, casePos],
            {
                y: -12,
            },
            {
                y: 0,
                delay: 1,
                duration: 1,
                ease: "power2.out",
                stagger: 0.2,
                onComplete: animateScroll,
            },
        );
    } else {
        animateScroll();
    }

    // animation => rotate  when adding item to cart
    if (!isReducedMotion) {
        watch(totalItem, (next, prev) => {
            if (next <= prev) return;

            gsap.to([cardRot, caseRot], {
                y: `+=${Math.PI}`,
                duration: 0.8,
                stagger: 0.05,
                ease: "power2.inOut",
            });
        });
    }
});
</script>

<template>
    <TAbsoluteGroup :x="options.x" :distance="20">
        <!-- Deck Cards -->
        <TresGroup :position="options.cardPos" :scale="options.scale">
            <Levioso>
                <TresGroup ref="cardRef">
                    <TresGroup ref="cardInternalRef">
                        <TCards
                            model="aurelia"
                            :foilDeck="activeCustomColor"
                            :rotation="[Math.PI / 2, -Math.PI / 6, 0]"
                        />
                    </TresGroup>
                </TresGroup>
            </Levioso>
        </TresGroup>

        <!-- Deck Box -->
        <TresGroup :position="options.casePos" :scale="options.scale">
            <Levioso>
                <TresGroup ref="caseRef">
                    <TresGroup ref="caseInternalRef">
                        <TCase
                            model="aurelia"
                            :foilDeck="activeCustomColor"
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
        :shadow-mapSize-width="2048"
        :shadow-mapSize-height="2048"
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
