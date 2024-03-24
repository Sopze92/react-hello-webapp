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

// radialmenu component
const RadialMenu= ({ boundsElement, measures, items })=>{

  const 
    radialContainer= React.useRef(null),
    heldInfo= useLongClick(boundsElement, 200),
    [ radialMenu, setRadialMenu ]= React.useState({state:false})

  React.useEffect(()=>{
    if(heldInfo.state && !radialMenu.state){

      // limit spawn coords just to prevent rendering the radial out of viewport

      const radialInfo= structuredClone(heldInfo)
      radialInfo.originX= _clamp(radialInfo.originX, measures.sizeHalf, window.innerWidth - measures.sizeHalf)
      radialInfo.originY= _clamp(radialInfo.originY, measures.sizeHalf, window.innerHeight - measures.sizeHalf)
      radialInfo.moveDelay= 12;

      radialInfo.mouse= (e)=>{
        if(radialInfo.moveDelay > 0) radialInfo.moveDelay--
        else{
          let rad = Math.atan2(e.y - radialInfo.originY, e.x - radialInfo.originX) + Math.PI*.5
          if(rad < 0 ? rad+Math.PI : rad)
          _getItemAtAngle(rad)
        }
      }

      document.addEventListener('mousemove', radialInfo.mouse)
      
      setRadialMenu(radialInfo)
      return ()=>{ document.removeEventListener('mousemove', radialInfo.mouse) }
    }
  },[heldInfo])

  function handleClick(e){
    if((e.touches && e.touches[0].target=== radialContainer.current) || e.target=== radialContainer.current) setRadialMenu({state:false})
    console.log(e)
  }

  function _getItemLocation(rad){
    return { 
      "--cv-rmi-x": Math.sin(rad) * measures.itemOffset, 
      "--cv-rmi-y": Math.cos(rad) * -measures.itemOffset 
    }
  }

  function _getItemAtAngle(rad){
    for(let i=0; i<items.length; i++){
      
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
                    <li key={`ri${i}`} className="px-4 py-2 sw-radialmenu-item" style={_getItemLocation(e.rad)}>{e.label}</li>
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