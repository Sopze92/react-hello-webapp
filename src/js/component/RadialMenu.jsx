import React from 'react'

import { Context } from "../store/AppContext.jsx"
import useLongClick from "../effect/useLongClick.jsx"

const RAD2DEG= 180 / Math.PI;

// seriously with no clamp() in vanilla js? is just dumb ¯\_(-.-)_/¯
function _clamp(n, min, max) { return n<min?min:n>max?max:n }
function _rad2deg(rad) { return rad * RAD2DEG}

const RADIALMENU_STATE= Object.freeze({ opening: 0, open: 1, closing: 2, closed: 3, })
const RADIALMENU_ANIM= Object.freeze([ "open", null, "hide", null])

// ---------------------------------------------------------------------------------------------------- radialmenu component
const RadialMenu= ({ boundsElement, measures, items, callback, animprefix="rm-anim" })=>{

  const 
    radialContainer= React.useRef(null), radialElement= React.useRef(null),
    heldInfo= useLongClick(boundsElement, 200),

    [ radialMenuState, setRadialMenuState ]= React.useState(RADIALMENU_STATE.closed), // 0 opening/closing 1 open 2 closed
    [ radialMenu, setRadialMenu ]= React.useState(),
    [ mouseCoords, setMouseCoords ]= React.useState(null),
    [ selectionState, setSelectionState ]= React.useState([-1,-1])

  // open menu effect
  React.useEffect(()=>{
    if(heldInfo.state && radialMenuState===RADIALMENU_STATE.closed){

      const radialInfo= structuredClone(heldInfo)
      let sizeHalf= measures.size*.5;

      // limit spawn coords just to prevent rendering the radial out of viewport
      radialInfo.originX= _clamp(radialInfo.originX, sizeHalf, window.innerWidth - sizeHalf)
      radialInfo.originY= _clamp(radialInfo.originY, sizeHalf, window.innerHeight - sizeHalf)
      document.addEventListener('mousemove', _setMouseCoords) 
      setRadialMenu(radialInfo)
      setRadialMenuState(RADIALMENU_STATE.opening)
      return ()=>{
        setMouseCoords(null)
        document.removeEventListener('mousemove', _setMouseCoords) 
      }
    }
  },[heldInfo])

  // mouse position effect
  // using this func as a listener arg instead on useEffect made this func unable to get current activeItem, the value was always whatever it was at addEventListener's call
  // this is a workaround to ensure activeItem is the current value on hovered update function so we dont re-assign the value all the time to its exact same value
  React.useEffect(()=>{
    if(mouseCoords && radialMenuState <= RADIALMENU_STATE.closing){
      const 
        pos= { x: mouseCoords.x - radialMenu.originX, y: mouseCoords.y - radialMenu.originY},
        mag= Math.sqrt(pos.x**2 + pos.y**2)

      let 
        item= -1,
        ang = Math.atan2(pos.y, pos.x) + Math.PI*.5 + measures.radPerItem*.5

      if(ang < 0) ang+=Math.PI*2

      if(mag > measures.size*.25){
        item= (ang/measures.radPerItem) >>> 0;
      }
      
      setSelectionState([item, ang])
    }
  },[mouseCoords])

  function _setMouseCoords(e){ setMouseCoords({x: e.x, y: e.y})}

  // ------------------------------------------ handlers

  function handleClick(e){
    if(radialMenuState !== RADIALMENU_STATE.closed) {
      if((e.touches && e.touches[0].target=== radialContainer.current) || e.target=== radialContainer.current) {
        setRadialMenuState(RADIALMENU_STATE.closing)
      }
      if(selectionState && selectionState[0] != -1) callback(selectionState[0])
      setSelectionState([-1, selectionState[1]])
      setMouseCoords(null)
    }
  }

  function handleAnimationEnd(){
    setRadialMenuState(radialMenuState === RADIALMENU_STATE.opening ? RADIALMENU_STATE.open : RADIALMENU_STATE.closed)
  }

  // ------------------------------------------ helpers / util

  function _getItemLocation(rad){
    return { 
      "--cv-rmi-x": Math.sin(rad) * measures.itemOffset, 
      "--cv-rmi-y": Math.cos(rad) * -measures.itemOffset 
    }
  }

  function _getAnimName(idx){
    const anim= RADIALMENU_ANIM[idx];
    return anim ? `${animprefix}-${anim}` : ""
  }

  return (
    <>
      <div ref={radialContainer} id="rm-container" onClick={(e)=>handleClick(e)}>
      {
        radialMenuState!== RADIALMENU_STATE.closed &&
        <div ref={radialElement} id="rm-object" 
          className={_getAnimName(radialMenuState)}
          onClick={e=>handleClick(e)} onAnimationEnd={handleAnimationEnd} 
          style={{
            "--cv-rm-x": `${radialMenu.originX}px`, "--cv-rm-y": `${radialMenu.originY}px`,
            "--cv-rm-w": `${measures.size}px`, "--cv-rm-h": `${measures.size}px`,
            "--cv-rm-a": `${selectionState[1] - measures.radPerItem*.5}rad`
            }}>
            <div className="rm-pointer"></div>
            <ul className={`text-center rm-itemgroup`}>
              {
                items.map((e,i)=>
                    <li key={`ri${i}`} className={`px-4 py-2 rm-item ${selectionState && selectionState[0]===i ? "active" : ""}`} style={_getItemLocation(e.rad)}>{e.label}</li>
                  )
              }
            </ul>
        </div>
      }
      </div>
    </>
  )
}

export default RadialMenu