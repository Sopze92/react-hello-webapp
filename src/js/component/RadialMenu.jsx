import React from 'react'

const RAD2DEG= 180 / Math.PI;

// seriously with no clamp() in vanilla js? is just dumb ¯\_(-.-)_/¯
function _clamp(n, min, max) { return n<min?min:n>max?max:n }
function _rad2deg(rad) { return rad * RAD2DEG}

/** Custom hook to handle a long click/touch performed inside an element boundaries */
const useLongClick= (element, ms)=>{
	const 
		[heldInfo, setHeldInfo]= React.useState({state: false}),
		[intervalId, setIntervalId]= React.useState(-1)

	React.useEffect(()=>{
		window.addEventListener('mousedown', handleMouseDown)
		window.addEventListener('touchstart', handleTouchStart)
		return () => {
			window.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('touchstart', handleTouchStart)
		}
	},[])

	React.useEffect(()=>{
		if(intervalId != -1) {
			window.addEventListener('mouseup', handleMouseUp)
			window.addEventListener('touchend', handleMouseUp)
		}
	},[intervalId])

	function handleMouseDown(e) { if(e.buttons===1) handleValidClick(e, true, { x:e.clientX, y:e.clientY }) }
	function handleTouchStart(e) { if(e.touches && e.touches.length==1) handleValidClick(e, false, { x:e.touches[0].clientX, y:e.touches[0].clientY }) }

	function handleValidClick(e, mus, pos){
		if(element.current){
			const bbox= element.current.getBoundingClientRect();
			if(pos.x >= bbox.left && pos.x < bbox.right && pos.y >= bbox.top && pos.y < bbox.bottom){
				setIntervalId(setTimeout(()=>{
					e.stopPropagation()
					e.preventDefault()
					setHeldInfo({state: true, mouse: mus, originX: pos.x, originY: pos.y})
				}, ms))
			}
		}
	}

	function handleMouseUp(e) {
		window.removeEventListener('mouseup', handleMouseUp)
		window.removeEventListener('touchend', handleMouseUp)
		clearTimeout(intervalId)
		setIntervalId(-1)
		setHeldInfo({state: false})
	}

	return heldInfo;
}

// ---------------------------------------------------------------------------- radialmenu component
const RadialMenu= ({ boundsElement, measures, items })=>{

  const 
    radialContainer= React.useRef(null),
    heldInfo= useLongClick(boundsElement, 200),
    [ radialMenu, setRadialMenu ]= React.useState({state:false}),
    [ mouseCoords, setMouseCoords ]= React.useState(null),
    [ activeItem, setActiveItem ]= React.useState(-1)

  // open menu effect
  React.useEffect(()=>{
    if(heldInfo.state && !radialMenu.state){

      // limit spawn coords just to prevent rendering the radial out of viewport

      const radialInfo= structuredClone(heldInfo)
      let sizeHalf= measures.size*.5;
      radialInfo.originX= _clamp(radialInfo.originX, sizeHalf, window.innerWidth - sizeHalf)
      radialInfo.originY= _clamp(radialInfo.originY, sizeHalf, window.innerHeight - sizeHalf)
      document.addEventListener('mousemove', _setMouseCoords) 
      setRadialMenu(radialInfo)
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
    if(mouseCoords){
      const 
        pos= { x: mouseCoords.x - radialMenu.originX, y: mouseCoords.y - radialMenu.originY},
        mag= Math.sqrt(pos.x**2 + pos.y**2)

      if(mag > measures.size*.25){

        let rad = Math.atan2(pos.y, pos.x) + Math.PI*.5 + measures.radPerItem*.5
        if(rad < 0) rad+= Math.PI*2

        const item= (rad/measures.radPerItem) >>> 0;
        _setActiveItem(item)
      }
      else _setActiveItem(-1)
    }

    function _setActiveItem(idx){
      if(activeItem != idx) setActiveItem(idx)
    }
  },[mouseCoords])

  function _setMouseCoords(e){ setMouseCoords({x: e.x, y: e.y})}

  // handlers

  function handleClick(e){
    if((e.touches && e.touches[0].target=== radialContainer.current) || e.target=== radialContainer.current) setRadialMenu({state:false})
    console.log(e)
  }

  // helpers / util

  function _getItemLocation(rad){
    return { 
      "--cv-rmi-x": Math.sin(rad) * measures.itemOffset, 
      "--cv-rmi-y": Math.cos(rad) * -measures.itemOffset 
    }
  }

  return (
    <>
      <div ref={radialContainer} id="sw-radialmenu-container" onClick={(e)=>handleClick(e)}>
      {
        radialMenu.state &&
        <div onClick={(e)=>handleClick(e)}>
          <div id="sw-radialmenu" style={{
            "--cv-rm-x": `${radialMenu.originX}px`, "--cv-rm-y": `${radialMenu.originY}px`,
            "--cv-rm-w": `${measures.size}px`, "--cv-rm-h": `${measures.size}px`
            }}>
            <ul className="text-center sw-radialmenu-itemgroup">
              {
                items.map((e,i)=>
                    <li key={`ri${i}`} className={`px-4 py-2 sw-radialmenu-item ${activeItem===i ? "active" : ""}`} style={_getItemLocation(e.rad)}>{e.label}</li>
                  )
              }
            </ul>
          </div>
        </div>
      }
      </div>
    </>
  )
}

export default RadialMenu