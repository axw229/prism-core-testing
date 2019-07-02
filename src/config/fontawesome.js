// https://fontawesome.com/icons/search

// fontawesome imports
import { library, config } from '@fortawesome/fontawesome-svg-core'

// solids
import {
  faPlus,
  faTrash,
  faImage,
  faInfoCircle,
  faInfo,
  faPalette,
  faSearchMinus,
  faSearch,
  faTimes,
  faHome,
  faSun,
  faMoon,
  faMoonStars,
  faCheck,
  faChevronUp,
  faAngleLeft,
  faAngleUp,
  faAngleDown,
  faCheckCircle
} from '@fortawesome/pro-solid-svg-icons'

// lights
import {
  faHome as falHome,
  faPlusCircle,
  faSun as falSun,
  faThLarge,
  faMoon as falMoon,
  faExpandAlt,
  faCompressAlt,
  faRedo as falRedo,
  faUndo as falUndo,
  faCircle as falCircle
} from '@fortawesome/pro-light-svg-icons'

// regulars
// import {
//   faExpandAlt
// } from '@fortawesome/pro-regular-svg-icons'

// populate with all the FontAwesome svg icons we want to use
const faIcons = [
  faExpandAlt,
  faCompressAlt,
  faHome,
  falHome,
  faMoon,
  falMoon,
  faMoonStars,
  faPalette,
  faPlus,
  faPlusCircle,
  faTimes,
  faTrash,
  faThLarge,
  faInfoCircle,
  faImage,
  faInfo,
  faSearchMinus,
  faSearch,
  faSun,
  falSun,
  faCheck,
  faChevronUp,
  faAngleLeft,
  faAngleUp,
  faAngleDown,
  faCheckCircle,
  falRedo,
  falUndo,
  falCircle
]
library.add(...faIcons)

// don't automatically inject the CSS into the DOM because we're importing ALL of it into our own bundle
// this is done so we can prefix all selectors with .cleanslate.prism
config.autoAddCss = false
