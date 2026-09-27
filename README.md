# ShowGa 3D 撲克牌電商 [中文版]

[EN version ReadMe](#showga-3d-playing-card-ecommerce-EN)

Nuxt, Vue練習專案
Blender建模撲克牌組，Threejs技術呈現的3D撲克牌視覺互動購物網站。
透過figma製作的撲克牌花色Mask，客製化撰寫fragment shader，
呈現顏色，以此減少使用所需要的base color texture數量。

🎮 網站：[showga-playing-card.vercel.app](showga-playing-card.vercel.app)

## 使用技術 (Tech Stack)

- 前端:
    - [Nuxt](https://nuxt.com/)
    - [Vue](https://vuejs.org/)
    - [Three.js](https://threejs.org/)
    - [TresJS](https://tresjs.org/)
    - [Tres/Cientos](https://cientos.tresjs.org/)
    - [Prismic](https://prismic.io/)
    - [GSAP](https://gsap.com/)
    - [Stripe](https://stripe.com/)

## 功能特色

- 燙金效果
    - 使用PBR材質MeshStandardMaterial，並使用onBeforeCompile
      method修改fragment shader，一種mask texture就能夠產生多種
      顏色燙金，不需要base color texture

- 3D物件互動
    - Scroll旋轉
    - 購物車新增物品時旋轉互動動畫

- 變換牌組
    - HTML設定data attribute，滑動到牌組HTML section，3D物件
      變換成相對應的顏色

### 專案截圖

![image](https://raw.githubusercontent.com/ShowGa/Pic-repository/refs/heads/main/PlayingCard-Project_feature1_1.webp)
![image](https://raw.githubusercontent.com/ShowGa/Pic-repository/refs/heads/main/PlayingCard-Project_feature1_2.webp)
![image](https://raw.githubusercontent.com/ShowGa/Pic-repository/refs/heads/main/PlayingCard-Project_feature1_3.webp)

## 部署資訊

- 前端(Nuxt) : [Vercel](https://vercel.com/)

## 致謝

特別感謝Lucie from Prismic的Nuxt教學:

- Build a 3D Nuxt 4 e-commerce Website
    - https://www.youtube.com/watch?v=1ryWEqumhYI

---

# ShowGa 3D Playing Card E-commerce

[中文版](#showga-3d-撲克牌電商)

A practice project built with Nuxt and Vue.

ShowGa is a 3D playing card e-commerce website featuring interactive 3D visuals powered by Three.js. The playing card models were created in Blender, while custom fragment shaders are used to achieve dynamic foil colors with fewer base color textures.

🎮 Website: [showga-playing-card.vercel.app](showga-playing-card.vercel.app)

## Tech Stack

- Frontend:
    - [Nuxt](https://nuxt.com/)
    - [Vue](https://vuejs.org/)
    - [Three.js](https://threejs.org/)
    - [TresJS](https://tresjs.org/)
    - [Tres/Cientos](https://cientos.tresjs.org/)
    - [Prismic](https://prismic.io/)
    - [GSAP](https://gsap.com/)
    - [Stripe](https://stripe.com/)

## Features

### Foil Effect

- Uses `MeshStandardMaterial` with PBR materials.
- Customizes the fragment shader through the `onBeforeCompile` method.
- A single mask texture can be used to generate multiple foil colors, reducing the need for multiple base color textures.

### 3D Object Interaction

- Rotate the 3D playing cards while scrolling.
- Animated card rotation when adding an item to the shopping cart.

### Card Deck Transformation

- Uses HTML `data-*` attributes to define the corresponding deck colors.
- As the user scrolls to different deck sections, the 3D playing card model dynamically changes to match the selected color.

## Screenshots

![image](https://raw.githubusercontent.com/ShowGa/Pic-repository/refs/heads/main/PlayingCard-Project_feature1_1.webp)
![image](https://raw.githubusercontent.com/ShowGa/Pic-repository/refs/heads/main/PlayingCard-Project_feature1_2.webp)
![image](https://raw.githubusercontent.com/ShowGa/Pic-repository/refs/heads/main/PlayingCard-Project_feature1_3.webp)

## Deployment

- Frontend (Nuxt): [Vercel](https://vercel.com/)

## Credits

Special thanks to Lucie from Prismic for the Nuxt tutorial:

- **Build a 3D Nuxt 4 e-commerce Website**
    - https://www.youtube.com/watch?v=1ryWEqumhYI
