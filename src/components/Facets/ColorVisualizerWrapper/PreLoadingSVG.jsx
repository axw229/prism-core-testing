import React from 'react'
import CircleLoader from '../../Loaders/CircleLoader/CircleLoader'

export const PreLoadingSVG = () => {
  return (
    <div className='cvw__loading__wrapper'>
      <svg style={{ zoom: '30' }} version='1.1' baseProfile='tiny' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1200 1200' xmlSpace='preserve'>
        <g id='flower-container' data-svg-origin='610.2215728759766 492.3915252685547' style={{ transform: 'matrix(1, 0, 0, 1, 0, 0)' }}>
          <polygon className='loading__outer__rect' fill='#E17000' path='' points='600,386 691,452 691,186 509,186 509,452' />
          <polygon className='loading__outer__rect' fill='#B71234' path='' points='691,452 656,560 910,478 854,304 600,386' />
          <polygon className='loading__outer__rect' fill='#00B9E4' path='' points='656,560 544,560 700,774 848,668 691,452' />
          <polygon className='loading__outer__rect' fill='#69BE28' path='' points='544,560 509,452 352,668 500,774 656,560' />
          <polygon className='loading__outer__rect' fill='#FFB612' path='' points='509,452 600,386 346,304 290,478 544,560' />
          <polygon className='loading__inner__rect' fill='#D2492A' path='' points='600,386 691,452 691,356' />
          <polygon className='loading__inner__rect' fill='#7C109A' path='' points='691,452 656,560 748,530' />
          <polygon className='loading__inner__rect' fill='#009581' path='' points='656,560 544,560 600,637' />
          <polygon className='loading__inner__rect' fill='#BED600' path='' points='544,560 509,452 452,530' />
          <polygon className='loading__inner__rect' fill='#E9994A' path='' points='509,452 600,386 509,357' />
          <polygon className='loading__inner__rect' fill='#FFF' points='600,386 691,452 656,560 544,560 509,452' id='pentagon' data-svg-origin='600 481.7' style={{ transform: 'matrix(1, 0, 0, 1, 0, 0)' }} /></g>
        <g id='text' className='loading__text' data-svg-origin='613.5000228881836 900.3800109863281' style={{ opacity: '1', transform: 'matrix(1, 0, 0, 1, 0, 0)' }}>
          <path id='sherwin' fill='#565A5C' d='M371.5,846.6C371.5,846.6,371.5,846.6,371.5,846.6C371.5,846.6,371.5,846.6,371.5,846.6c0,14.5-14.1,16.1-20.2,16.1c-4.2,0-8.9-0.9-13.8-2.6c0,0,0,0,0-0.1c0,0,0,0,0,0c0.2-0.7,2.1-6.9,2.3-7.6c3.5,1.6,7.6,3.2,12,3.2c4.9,0,9.9-2.5,9.9-8c0-4.2-3.6-6.2-7.5-8.3c-4.7-2.6-9.6-5.3-9.6-12.2c0,0,0,0,0,0c0,0,0,0,0,0c0-10.7,9.8-14.5,18.2-14.5c4.8,0,8.9,0.7,12.5,2.1c0,0,0,0,0,0.1c0,0,0,0,0,0c-0.2,0.6-1.9,6.7-2.1,7.3c-3.2-1.5-6.8-2.4-10.1-2.4c-4.3,0-8.7,1.8-8.8,6c0,3.6,3.4,5.6,7,7.6C366.2,835.9,371.5,839,371.5,846.6z M671.6,813.1c-0.2,0.4-16.4,37.5-16.4,37.5l-0.7-0.1c0,0-0.2-36.7-0.2-37.3c-0.6,0-11.6,0-12,0c-0.2,0.4-15.4,37.5-15.4,37.5l-0.7-0.1c0,0-1.4-36.8-1.4-37.4c-0.5,0-8.1,0-8.7,0c0,0.6,2.9,47.9,2.9,48.5c0.5,0,10.7,0,11,0c0.2-0.4,16.3-39.1,16.3-39.1l0.7,0.1c0,0,0.5,38.4,0.5,39c0.6,0,10.8,0,11.2,0c0.2-0.4,21.5-47.7,21.9-48.5C679.8,813.1,672,813.1,671.6,813.1z M680.3,822.6l-7.8,39.1h8.3l7.8-39.1H680.3z M702.7,822.6h-8l-7.9,39.1H709l1.4-6.7h-14.3L702.7,822.6z M728.7,823l0.1-0.4h-8l-7.9,39.1h22.3l1.4-6.7h-14.3L728.7,823z M746.5,822.6l-7.8,39.1h8.3l7.8-39.1H746.5z M781,822.6l6.7,39.1h-8l-1.3-8.8h-15l-4.6,8.8h-8.9l22.5-39.1H781z M775.2,830.6l-8.2,15.6h10.3L775.2,830.6z M827.7,822.6l-14,27l-2.4-26.7l0-0.3h-12.7l-7.9,39.1h7.6l6.3-30.2l2.8,30.2h7.5l15.6-30.1l-6.4,29.6l-0.1,0.4h8.4l7.9-39.1H827.7z M866.1,823.7c-2.7-1.2-5.9-1.7-9.6-1.7c-6.4,0-13.9,3.1-13.9,12c0,5.8,3.9,8.1,7.3,10.1c2.8,1.6,5.1,3,5.1,6c0,3.9-3.3,5.7-6.6,5.7c-3.2,0-6.2-1.3-8.8-2.6l-0.4-0.2l-2.1,7.3l0.3,0.1c3.7,1.4,7.3,2.2,10.5,2.2c9.7,0,15.3-4.8,15.3-13.2c0-6.3-4.2-8.9-7.6-11c-2.6-1.6-4.8-3-4.8-5.5c0-3.2,3.6-4.1,5.8-4.1c2.4,0,5.1,0.7,7.4,1.9l0.4,0.2l1.9-7L866.1,823.7z M590.1,846.8h16.6l1.7-8.1h-16.7L590.1,846.8z M404.5,822.6l-3.3,15.5h-15.1l3.3-15.5h-8.6l-8.3,39.1h8.6l3.6-16.9h15.1l-3.6,16.9h8.6l8.3-39.1H404.5z M426.1,829.3h15.3l1.3-6.7H419l-8.4,39.1h24l1.5-6.8h-15.5l2.1-10.1h13.7l1.4-6.7h-13.7L426.1,829.3z M474.2,832c0,5.7-3.8,9.7-9.9,10.5c1.2,0.6,2.1,1.7,2.5,3.3l3.9,15.9h-9l-2-9.3c-0.1-0.6-0.2-1.2-0.4-1.8c-0.6-3.2-0.9-4.9-4.2-4.9h-2.7l-3.4,16h-8.6l8.3-39.1h10C465.7,822.6,474.2,822.6,474.2,832z M459,829.3h-3l-2,9.7h2.4c2.7,0,9-0.6,9-6C465.4,829.3,462.3,829.3,459,829.3z M525,822.6l-13.4,28.5l-0.2-28.5h-11.1l-12.6,28.5l-1.1-28.5H478l2.5,39.1h10.2l13.3-29.7l0.4,29.7h10.4l19-39.1H525z M537.3,822.6l-8.4,39.1h8.9l8.4-39.1H537.3z M571.3,850.9l-8.1-28.3h-10.5l-8.6,39.1h8.2l6-28.6l7.9,28.3l0.1,0.3H577l8.5-38.7l0.1-0.4h-8.1L571.3,850.9z M871.9,857.1l1.6,2.6h-1.3l-1.4-2.6h-0.6v2.6h-1.3v-6h2.3c1.5,0,2.4,0.5,2.4,1.8C873.5,856.6,872.8,857,871.9,857.1z M872.2,855.4c0-0.6-0.7-0.7-1.2-0.7h-0.9v1.5h1C871.7,856.1,872.2,856,872.2,855.4z M876.4,856.7c0,3-2.4,5.4-5.4,5.4c-3,0-5.4-2.4-5.4-5.4c0-3,2.4-5.4,5.4-5.4C873.9,851.3,876.4,853.7,876.4,856.7z M874.8,856.7c0-2.5-1.7-4.2-3.9-4.2c-2.2,0-3.9,1.7-3.9,4.2c0,2.5,1.7,4.2,3.9,4.2C873.1,860.9,874.8,859.2,874.8,856.7z' />
          <path id='colorSnap' fill='#565A5C' d='M172.7,1012.6c-34.8,0-59.1-24.5-59.1-55.4s23.4-55.3,59.1-55.3c8.5,0,18.5,1.1,25.8,3.4l-1.6,7.9c-7.9-1.9-16.8-2.9-24.5-2.9c-28.5,0-49,18.7-49,46.9c0,28.2,20.8,47.1,49,47.1c7.1,0,15.5-0.8,24.2-2.9l1.9,7.7C190.6,1011.3,181.4,1012.6,172.7,1012.6z M265.2,1012.6c-30.1,0-50.6-25.1-50.6-55.3c0-30.1,20.5-55.4,50.6-55.4c30.1,0,50.6,25.3,50.6,55.4C315.8,987.5,295.4,1012.6,265.2,1012.6z M265.2,910.3c-24.2,0-40.9,20.1-40.9,47.1c0,26.9,16.8,46.9,40.9,46.9c24.2,0,40.9-20,40.9-46.9C306.2,930.4,289.4,910.3,265.2,910.3z M340.8,1010.8V903.5h9.7v98.9h56.4v8.4H340.8z M467.1,1012.6c-30.1,0-50.6-25.1-50.6-55.3c0-30.1,20.5-55.4,50.6-55.4c30.1,0,50.6,25.3,50.6,55.4C517.7,987.5,497.3,1012.6,467.1,1012.6z M467.1,910.3c-24.2,0-40.9,20.1-40.9,47.1c0,26.9,16.8,46.9,40.9,46.9c24.2,0,40.9-20,40.9-46.9C508.1,930.4,491.3,910.3,467.1,910.3z M624.1,1010.8l-34.3-46.6h-37.4v46.6h-9.7V903.5h48.5c20.8,0,32.6,14.7,32.6,30.5c0,13.4-8.5,25.9-23.9,29.3l35.1,47.5H624.1z M591.2,911.9h-38.8v44.3h38.8c14.3,0,22.9-8.9,22.9-22.2C614.1,920.6,603.4,911.9,591.2,911.9z M836.4,1010.8l-51.9-70.9v70.9h-23.9V903.5h23.5l51.9,71.1v-71.1H860v107.3H836.4z M956,1010.8l-8.2-22.1h-39.6l-8.4,22.1h-23.7l40.8-107.3h22.2l40.6,107.3H956z M928,927.7l-14,42.9h27.9L928,927.7z M1052.2,974.3h-32.4v36.6h-24V903.5h56.4c21.4,0,36.3,16,36.3,35.1C1088.5,957.8,1073.6,974.3,1052.2,974.3z M1048.2,922.8H1020l-0.2,31.9h28.4c8.4,0,15.5-7.1,15.5-16.1C1063.6,929.6,1056.6,922.8,1048.2,922.8z M739.4,986.2c7.9-44.8-63.2-30.4-59.2-53c3.1-17.4,53.5-3.9,53.5-3.9l3.7-22.2c0,0-77-20.7-84.4,21.3c-7.4,41.8,63.1,29.9,59.2,53c-2.9,17.5-59.2,0.6-59.2,0.6l-5.2,21.3C647.9,1003.3,731.2,1032.7,739.4,986.2z M1102.8,927.9c-6.3,0-10.6-5-10.6-11c0-6,4.4-11,10.6-11s10.6,5,10.6,11C1113.4,922.9,1109.1,927.9,1102.8,927.9z M1102.8,907.9c-5.2,0-8.4,4.4-8.4,9c0,4.5,3.2,9,8.4,9s8.4-4.5,8.4-9C1111.2,912.4,1108.1,907.9,1102.8,907.9z M1105.6,922.3l-2.7-3.7h-1.9v3.7h-2.8v-10.8h6.1c2.1,0,3.6,1.6,3.6,3.6c0,1.3-0.8,2.5-1.9,3.1l3,4.1H1105.6z M1103.8,913.8h-2.7v2.8h2.7c0.7,0,1.3-0.6,1.3-1.4C1105.1,914.3,1104.5,913.8,1103.8,913.8z' />
        </g>
        <path id='trademark' fill='#00B9E4' d='M747.1,759.9v10.4h-1.6v-10.4h-4v-1.4h9.6v1.4H747.1z M763.3,770.4v-8.9l-3.7,7.1h-1l-3.6-7.1v8.9h-1.6v-11.8h1.6l4.2,7.9l4.2-7.9h1.6v11.8H763.3z' style={{ opacity: '0.989601' }} />
      </svg>
      <CircleLoader style={{ maxHeight: 'none' }} />
    </div>
  )
}
