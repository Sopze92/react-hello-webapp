import React from 'react'

/** Custom hook i made to handle a long click/touch performed inside an element boundaries */
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
				e.preventDefault(); e.stopPropagation()
				setIntervalId(setTimeout(()=>{
					setHeldInfo({state: true, mouse: mus, originX: pos.x, originY: pos.y})
				}, ms))
			}
		}
	}

	function handleMouseUp(e) {
		window.removeEventListener('mouseup', handleMouseUp)
		window.removeEventListener('touchend', handleMouseUp)
		e.preventDefault(); e.stopPropagation()
		clearTimeout(intervalId)
		setIntervalId(-1)
		setHeldInfo({state: false})
	}

	return heldInfo;
}

export default useLongClick