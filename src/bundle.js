// @flow
import 'src/allFacets' // import all facets so they're included in the bundle
import { embedAtRoots, embedAtElement } from 'src/facetSupport/facetBinder'

// expose embed method on global PRISM object in order to manually call this later
window.PRISM = {
  ...(window.PRISM || {}),
  embed: embedAtElement
}

// perform embedding
embedAtRoots(true)
