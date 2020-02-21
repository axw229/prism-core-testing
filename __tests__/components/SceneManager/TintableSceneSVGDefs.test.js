import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import TintableSceneSVGDefs from 'src/components/SceneManager/TintableSceneSVGDefs'
import { SCENE_TYPES } from 'constants/globals'
import * as Colors from '__mocks__/data/color/Colors'

describe('<TintableSceneSVGDefs />', () => {
  test('render empty without provided type', () => {
    const wrapper = shallow(<TintableSceneSVGDefs />)
    expect(wrapper.find('defs').text()).toBe('')
  })

  describe(`${SCENE_TYPES.ROOM} SVG filters and masks`, () => {
    test('does not respond to shadow and highlight maps', () => {
      const component1 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.ROOM} shadowMap={'shadows'} highlightMap={'highlights'} />
      ).toJSON()

      const component2 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.ROOM} shadowMap={'other shadows'} highlightMap={'highlights'} />
      ).toJSON()

      const component3 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.ROOM} shadowMap={'other shadows'} highlightMap={'other highlights'} />
      ).toJSON()

      expect(component1).toEqual(component2)
      expect(component1).toEqual(component3)
      expect(component2).toEqual(component3)
    })

    test('feFlood is set to filterColor', () => {
      const color = Colors.getColor()
      const component1 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.ROOM} filterColor={color.hex} />
      )

      const colorObject = component1.root.findAll((el) => {
        return el.type === 'feFlood' && el.props.floodColor === color.hex
      })

      expect(colorObject).toHaveLength(1)
    })
  })

  describe(`${SCENE_TYPES.OBJECT} SVG filters and masks`, () => {
    test('responds to shadow and highlight maps', () => {
      const component1 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.OBJECT} shadowMap={'shadows'} highlightMap={'highlights'} />
      ).toJSON()

      const component2 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.OBJECT} shadowMap={'other shadows'} highlightMap={'highlights'} />
      ).toJSON()

      const component3 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.OBJECT} shadowMap={'other shadows'} highlightMap={'other highlights'} />
      ).toJSON()

      expect(component1).not.toEqual(component2)
      expect(component1).not.toEqual(component3)
      expect(component2).not.toEqual(component3)
    })

    test('feFlood is set to filterColor', () => {
      const color = Colors.getColor()
      const component1 = renderer.create(
        <TintableSceneSVGDefs type={SCENE_TYPES.OBJECT} filterColor={color.hex} />
      )

      const colorObject = component1.root.findAll((el) => {
        return el.type === 'feFlood' && el.props.floodColor === color.hex
      })

      expect(colorObject).toHaveLength(1)
    })
  })
})
