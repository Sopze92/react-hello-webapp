import React from 'react'

import { Context } from "../store/AppContext.jsx"
import useLongClick from "../effect/useLongClick.jsx"

function _clamp(n, min, max) { return n<min?min:n>max?max:n }

const RADIALMENU_STATE= Object.freeze({ opening: 0, open: 1, closing: 2, closed: 3, })
const RADIALMENU_ANIM= Object.freeze([ "open", null, "hide", null])

// ---------------------------------------------------------------------------------------------------- radialmenu component
const RadialMenu= ({ boundsElement, enabled, measures, items, onStateChange, onInteract, animprefix="rm-anim" })=>{

  const 
    heldInfo= useLongClick(boundsElement, 250),                                           // useLongClick effect
    [ radialMenuState, setRadialMenuState ]= React.useState(RADIALMENU_STATE.closed),     // current state
    [ menuLocation, setMenuLocation ]= React.useState(),                                  // menu position
    [ mouseCoords, setMouseCoords ]= React.useState(null),                                // mouse position tracker
    [ bMouseClicked, setMouseClicked ]= React.useState(false),                            // mouse click tracker
    [ selectionState, setSelectionState ]= React.useState([-1,-1])                        // current selected menu item (item, angle)

  // startup, add mouseup listener
  React.useEffect(()=>{
    if(enabled){
      document.addEventListener('mouseup', _handleClickUp)
      return ()=> document.removeEventListener('mouseup', _handleClickUp)
    }
  },[enabled])

  function _handleClickUp(e){ setMouseClicked(true) }

  // open menu effect
  React.useEffect(()=>{
    if(enabled && heldInfo.state && radialMenuState===RADIALMENU_STATE.closed){
      
      // limit spawn coords just to prevent rendering the radial out of viewport
      const 
        sizeHalf= measures.size*.5,
        newMenuLocation= {
          originX: _clamp(heldInfo.originX, sizeHalf, window.innerWidth - sizeHalf),
          originY: _clamp(heldInfo.originY, sizeHalf, window.innerHeight - sizeHalf)
        }

      // start tracking mouse + set menu location and opening state 
      document.addEventListener('mousemove', _setMouseCoords)

      setRadialMenuState(RADIALMENU_STATE.opening)
      onStateChange(true)

      setMenuLocation(newMenuLocation)

      return ()=>{
        setMouseCoords(null)
        document.removeEventListener('mousemove', _setMouseCoords) 
      }
    }
  },[heldInfo])

  // mouse position effect, calc pointer angle and distance from origin to determine selected item
  React.useEffect(()=>{
    if(mouseCoords && radialMenuState <= RADIALMENU_STATE.closing){
      const 
        pos= { x: mouseCoords.x - menuLocation.originX, y: mouseCoords.y - menuLocation.originY},
        mag= Math.sqrt(pos.x**2 + pos.y**2)

      let 
        ang= selectionState[1],
        item= -1

      if(mag > measures.size*.125 ){
        ang = Math.atan2(pos.y, pos.x) + Math.PI*.5 + measures.radPerItem*.5
        if(ang < 0) ang+=Math.PI*2
        item= (ang/measures.radPerItem) >>> 0
      }
      
      setSelectionState([item, ang])
    }
  },[mouseCoords])

  function _setMouseCoords(e){ setMouseCoords({x: e.x, y: e.y})}

  // ------------------------------------------ handlers

  React.useEffect(()=>{
    if(bMouseClicked){
      if(radialMenuState !== RADIALMENU_STATE.closed){
        setRadialMenuState(RADIALMENU_STATE.closing)
        if(selectionState && selectionState[0] != -1) onInteract(selectionState[0])
        setSelectionState([-1, selectionState[1]])
        setMouseCoords(null)
      }
      setMouseClicked(false)
    }
  },[bMouseClicked])

  function handleAnimationEnd(){
    setRadialMenuState(radialMenuState === RADIALMENU_STATE.opening ? RADIALMENU_STATE.open : RADIALMENU_STATE.closed)
    if(radialMenuState === RADIALMENU_STATE.closing) onStateChange(false)
  }

  // ------------------------------------------ helpers / util

  function _getItemStyle(rad, col){
    return { 
      "--cv-rmi-x": Math.sin(rad) * measures.itemOffset, 
      "--cv-rmi-y": Math.cos(rad) * -measures.itemOffset,
      "--cv-rmi-col": col
    }
  }

  function _getAnimName(idx){
    const anim= RADIALMENU_ANIM[idx];
    return anim ? `${animprefix}-${anim}` : ""
  }

  function _getPointerStyle(){
    return {
      "--cv-rmi-col": selectionState[0] < 0 ? "#0000" : items[selectionState[0]].color
    }
  }

  return (
    <>
      {
        radialMenuState!== RADIALMENU_STATE.closed &&
        <div id="rm-overlay">
          <div id="rm-object" 
            className={_getAnimName(radialMenuState)}
            onAnimationEnd={handleAnimationEnd} 
            style={{
              "--cv-rm-x": `${menuLocation.originX}px`, "--cv-rm-y": `${menuLocation.originY}px`,
              "--cv-rm-w": `${measures.size}px`, "--cv-rm-h": `${measures.size}px`,
              "--cv-rm-a": `${selectionState[1] - measures.radPerItem*.5}rad`
              }}>
              <div className={`rm-pointer ${selectionState[0] < 0 ? "" : "active" }`} style={_getPointerStyle()}></div>
              <ul className={`text-center rm-itemgroup`}>
                {
                  items.map((e,i)=>
                      <li key={`ri${i}`} className={`px-4 py-2 rm-item ${selectionState && selectionState[0]===i ? "active" : ""}`} style={_getItemStyle(e.rad, e.color)}>{e.label}</li>
                    )
                }
              </ul>
          </div>
        </div>
      }
    </>
  )
}

export default RadialMenu