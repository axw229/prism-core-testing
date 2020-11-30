// @flow
export const groupScenesByCategory = (data: Array<Object>): Object => {
  if (data) {
    let categoryHashMap = {}
    let startIndexHashMap = {}
    let tmpHashMap = {}
    let groupScenes = []
    let collectionTabs = []
    let tabMap = []
    let index = 0
    for (let i = 0; i < data.length; i++) {
      const category = data[i].category
      if (category) {
        for (let j = 0; j < category.length; j++) {
          const tabName = category[j].toUpperCase()
          if (!categoryHashMap[tabName]) {
            collectionTabs.push({
              id: `tab${index}`,
              tabName: tabName
            })
            tmpHashMap[tabName] = `tab${index}`
            tabMap.push(`tab${index}`)
            startIndexHashMap[tabName] = groupScenes.length
            categoryHashMap[tabName] = 1
            index++
            groupScenes.push(data[i])
          } else {
            categoryHashMap[tabName]++
            const insertIndex = startIndexHashMap[tabName] + categoryHashMap[tabName] - 1
            groupScenes.splice(insertIndex, 0, data[i])
            tabMap.splice(insertIndex, 0, tmpHashMap[tabName])
          }
        }
      }
    }

    return {
      collectionTabs: collectionTabs,
      groupScenes: groupScenes,
      tabMap: tabMap
    }
  }
}