# @prism/facets
 
## 5.2.0

### Patch Changes

- 944a961d: removed duplicate webworker rule from webpack config [DCT-796]
- f228393d: Adjusted match photo label pin style for hgtv cvw [MESP-6013]
- dd1822c2: Use instance ID for activating colors on color wall
- 26257ed1: Added fontawesome providers and adjusted color navigator arrow click func [DCT-674]
- 1b6fb8f7: explicitly testing for disabled swatch states in search [DCT-761]
- Updated dependencies [944a961d]
- Updated dependencies [dd1822c2]
- Updated dependencies [c7a2e026]
- Updated dependencies [1f66518b]
- Updated dependencies [1385f25c]
  - @prism/toolkit@5.2.0

## 5.1.0

### Minor Changes

- f13d595d: Migrated lowes qr code color wall to v3 [DCT-674]
- 7f718f4b: Added pager position on Carousel and ColorCollections [MESP-7711]

### Patch Changes

- b9668a5e: Removed header texts and cleanup on ColorWallChunkChipFacet [MESP-6600]
- c6ee514a: preventing lodash polluting global namespace [DCT-728]
- 917b3ed5: removing unnecessary space around swach name/number [DCT-720]
- addecb59: Refactor prismManifest to be more concise and updated embed.js to accept new shape. [DCT-576]
- 817ea993: removing file-loader from webpack to fix misnamed images [DCT-723]
- d298507f: Fixed a bug in RealColor that caused a race condition in the crop logic. [COJO-1261]
- Updated dependencies [f13d595d]
- Updated dependencies [7f718f4b]
- Updated dependencies [f4a49424]
- Updated dependencies [f372f1f7]
- Updated dependencies [414aa9a7]
  - @prism/toolkit@5.1.0

## 5.0.0

### Major Changes

- 384bd271: updated ColorWall API to promote composability [DCT-438]

### Minor Changes

- 8260a632: Added menu overlay toogle logic from config api [MESP-6015]
- 5cd48521: Updated color pin offset on match photo [DCT-648]
- 389c2837: Added GTM support [DCT-642]
- b9b9372f: Add Typescript support to facets. [DCT-601]

### Patch Changes

- Updated dependencies [384bd271]
  - @prism/toolkit@5.0.0

## 4.2.0

### Minor Changes

- 3f87a8a1: Added toolkit LivePalette tailwind css media-query declarations for precompilation [DCT-637]
- c4514f6b: Added internal api/feature that allows the tabbed scene visualizer to programatically navigate to the first tab when an interior only color is chosen yet the exterior tab is selected. [DCT-634]
- 07249d3f: Migrated easy and condor cvw to color wall v3 [DCT-369]

### Patch Changes

- 7f7a1d86: Fixed a translation error for SW.com CA. [DCT-620]
- 22f146e0: Updated tab focus and aria labels on CDP [DCT-211]
  - @prism/toolkit@4.2.0

## 4.1.0

### Minor Changes

- d4e20847: Updated styles for the TabbedSceneVisualizer and introduced an optional new API to deal with programmatic breakpoint. [DCT-541]
- ba37b4d9: Added optional add color to lp on cdp coordinating colors [DCT-563]
- 1473aa78: Adjust flow config file so it can resolve imported modules correctly [DCT-XX]

### Patch Changes

- cbde21e6: Updated color collections showPageIndicators logic [DCT-549]
- 845d6265: fixing webpack configuration error preventing multiple facet embed [MESP-7250]
- e05ae60f: fixed build issue where async styles were not loading [DCT-583]
- e942af27: Fixed data that should display for tabbed scene alt tags [DCT-587].
- 199ed717: Adjusted position/style of single tintable scene action buttons [DCT-573]
- 44deadd0: Unflipped painted photos and use our photos urls [DCT-423]
- Updated dependencies [596c23ad]
- Updated dependencies [09dc67e3]
- Updated dependencies [7dce5377]
- Updated dependencies [d3dcae2b]
- Updated dependencies [a3887c88]
  - @prism/toolkit@4.1.0

## 4.0.0

### Major Changes

- 7e20e9cc: Updated the RealColor facet to handle different aspect ratios. A more flexible facet API was introduced to support AEM FE. [DCT-494]

### Minor Changes

- 411fa15b: Updated cvw intial loading to hero loader [DCT-371]
- 3e64aa76: Added translation structure for Sherwin-Williams Colors label [DCT-511]

### Patch Changes

- 692ad43b: Fix incorrect font-size for ColorDetails facet
- 5317f0d3: Updated color strip button and collection description wrap [DCT-422]
- ad7bf924: Updated get app link to open in a blank page [DCT-429]
- 779bd326: Updated get app selectDevice links order [DCT-429]
- c94eb433: Fix text/icon overlap in LivePallete
- 72047c82: Adjusted theme button border radius [DCT-425]
- d43932c6: Added hover state styling to the tabbed Scene Visualizer. [DCT-533]
- Updated dependencies [446fc9ee]
- Updated dependencies [c94eb433]
  - @prism/toolkit@4.0.0

## 3.5.0

### Minor Changes

- ce76de75: Fixes all facets imports order, unused imports and some var to let conversion [DCT-XX]

### Patch Changes

- Updated dependencies [7ad08e8c]
- Updated dependencies [14a91af7]
- Updated dependencies [14a91af7]
  - @prism/toolkit@3.5.0

## 3.4.0

### Minor Changes

- edeef215: Translated CVW us-es into Spanish [DCT-427]
- 9933270a: Adjusts the size of the inner color chip to acomodate larger content [MESP-6343]
- 7acefe1c: Migrated Toolbar minimal UI from Facets to Toolkit. [DCT-415]
- e53405f9: Refactors Color Chip Maximizer component. Fixes minor style issues. [MESP-6020]
- 85b287f1: adding subscribed event to ColorWall facet to allow activating a color [DCT-448]
- cb814b76: Refactor Compare Colors component [MESP-6009]
- b828c038: Fixing title spacing in wrapped view [DCT-323]
- 6a9b7a32: Added sherwin brazil and spanish color visualizer templates [DCT-430]
- fcbabae9: Updated RealColor/FatsMask crop logic to properly crop to a specified sceneWidth and sceneHeight. This changes the embed API slightly. [DCT-489]
- 9062c414: Translated CVW into Portuguese [DCT-426]
  Adjusted wall chunk section content alignment [DCT-426]

### Patch Changes

- 69dd1681: Fixed cvw pages close button route action and LP navigation intents [MESP-6007]
- 1e150af2: back button in ColorListingPage now more intelligently returns user to the color wall [DCT-365]
- 53eaf54e: Change checkbox for terms and conditions [MESP-6014]
- af10e0b9: Fixed bug that displayed download instead of upload icon [DCT-185]
- 05efc6ef: Implemented missing maxHeight on static**scene**image\_\_wrapper
- 9bfeacd1: A color context aware underline was added to the tabs of the Tabbed Scene Visualizer [DCT-398]
- Updated dependencies [84acba56]
- Updated dependencies [9933270a]
- Updated dependencies [7acefe1c]
- Updated dependencies [8405b3ec]
- Updated dependencies [85b287f1]
- Updated dependencies [b828c038]
- Updated dependencies [0afd6b0b]
- Updated dependencies [9062c414]
  - @prism/toolkit@3.4.0
