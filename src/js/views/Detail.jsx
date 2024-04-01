import React from "react";
import { useNavigate, useParams } from "react-router-dom"

import { Context } from "../store/AppContext"
import { Constants } from "../store/Flux.jsx";
import EntityCard from "../component/EntityCard.jsx";

import imgtemp from "../../img/temp.webp"

const imgerr= "https://starwars-visualguide.com/assets/img/big-placeholder.jpg"

const Detail= ()=>{
	const 
		{ ready, actions }= React.useContext(Context),
		{ type, uid }= useParams(Context),
		[ image, setImage ]= React.useState(imgtemp),
		[ entity, setEntity ]= React.useState(null),
		[ details, setDetails ]= React.useState(null),
		[ detailsReady, setDetailsReady ]= React.useState(false),
		nav= useNavigate()

	React.useEffect(()=>{
		_setData()
		async function _setData(){
			if(ready.state){
				const e= actions.getEntity(type, uid);
				if(e != null){
					setEntity(e)
					setDetails(await (e.url ? actions.getEntityDetails(e) : actions.parseEntityProperties(e)))
				}
				else nav("/")
			}
		}
	},[ready.state, window.location.href])

	React.useEffect(()=>{
		setDetailsReady(false)
		setImage(imgtemp)
	},[window.location.href])

	React.useEffect(()=>{ 
		setDetailsReady(Boolean(details)) 
	},[details])

	// picture
	React.useEffect(()=>{
		if(detailsReady){
			let picstate= actions.getPictureState(entity)
			if(picstate !== Constants.PICTURE_STATE.disabled){
				const imgurl= `https://starwars-visualguide.com/assets/img/${entity.thumb}`
				if(image===imgtemp || image != imgurl){
					if(picstate === Constants.PICTURE_STATE.unchecked){
						setImage(imgtemp)
						// instead of directly compose the image string and use it, check if image exists before, so we can handle a 404
						actions.testFile(imgurl)
							.then(res=>{
								setImage(res ? imgurl : imgerr)
								actions.setPictureState(entity, res ? Constants.PICTURE_STATE.enabled : Constants.PICTURE_STATE.disabled) // set image availability state so we dont even try to check/load it next time
							})
					}
					else setImage(imgurl)
				}
			}
			else setImage(imgerr)
		}
	},[detailsReady])

	return (
		<div className={`container-fluid placeholder-glow sw-entity-${detailsReady ? entity.type.name : "all"}`}>
			<div className="col-11 d-flex flex-column mx-auto mt-4">
				<div className="d-flex justify-content-between sw-header px-4">
					<div className="d-flex justify-content-start">
						{ detailsReady ? 
							<>
								<span className="fw-bold ms-0 my-auto sw-wspre">DETAILS //</span>
								<span className={`fw-bold ms-0 my-auto sw-wspre sw-colorize`}> {entity.type.name.toUpperCase()} </span>
								<span className="fw-bold ms-0 my-auto sw-wspre">// {entity.name.toUpperCase()} //</span>
							</>
							:
							<span className="fw-bold ms-0 my-auto">LOADING... //</span>
						}
					</div>
					<button className="sw-btn" onClick={()=>nav("/")} ><i className="sw-header-icon icon-home"/></button>
				</div>
				<div className="row d-flex me-1 p-2">
					<div className="col-5 d-flex flex-column mx-auto mt-4 sw-detailsleft">
						<div className="d-flex sw-details-image">
 							<img src={image} className="m-0 p-0 w-100 front" />
							<img src={image} className="m-0 p-0 w-100 blur" />
						</div>
						{ detailsReady ?
							<p className="fw-bold fs-3 mx-auto mt-4 sw-smallcaps" >{entity.name}</p>
							:
							<p className="mx-auto mt-4 placeholder placeholder-lg col-8" />
						}
					</div>
					<div className="col d-flex flex-column my-4 sw-detailsright">
						{ detailsReady &&
							_composeDetails(entity.type.index)
						}
					</div>
				</div>
				{ detailsReady && Object.keys(details.cards).length > 0 && _anyCard() &&
					<div className="sw-detailscards py-2 px-4">
						{
							_composeCards()
						}
					</div>
				}
				<div className="sw-footer">
				</div>
			</div>
		</div>
	)

	function _composeDetails(idx){

		const 
			f= details.fields

		switch(idx){
				case Constants.TYPES.films:
					return (
						<>
							<div className="row d-flex text-center my-auto sw-details-film0">
								<div className="row d-flex justify-content-between">
									<div className="col-6 text-end">
										<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[0].key}</p>
										<p className="pe-3">{f[0].value}</p>
									</div>
									<div className="col-6 text-start">
										<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[1].key}</p>
										<p className="ps-3">{f[1].value}</p>
									</div>
								</div>
								<div className="row d-flex justify-content-between">
									<div className="col-6 text-end">
										<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[2].key}</p>
										<p className="pe-3">{f[2].value}</p>
									</div>
									<div className="col-6 text-start">
										<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[3].key}</p>
										<p className="ps-3">{f[3].value}</p>
									</div>
								</div>
								<div className="row d-flex justify-content-center">
									<div className="col-6 text-center">
										<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[4].key}</p>
										<p>{f[4].value}</p>
									</div>
								</div>
							</div>
							<div className="row d-flex text-center mb-5 px-5">
								<p className="fw-bold fs-6 m-0 p-0 sw-colorize">{f[5].key}</p>
								<p className="ps-3">{f[5].value}</p>
							</div>
						</>
					)
			case Constants.TYPES.people:
				return (
					<>
						<div className="row d-flex text-center my-auto sw-details-people0">
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-3 m-0 p-0 sw-colorize">{f[0].key}</p>
								<p className="fs-5">{f[0].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[1].key}</p>
									<p className="pe-3">{f[1].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[2].key}</p>
									<p className="ps-3">{f[2].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[3].key}</p>
									<p className="pe-3">{f[3].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[4].key}</p>
									<p className="ps-3">{f[4].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-4 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[5].key}</p>
									<p className="pe-3">{f[5].value}</p>
								</div>
								<div className="col-4 text-center">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[6].key}</p>
									<p>{f[6].value}</p>
								</div>
								<div className="col-4 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[7].key}</p>
									<p className="ps-3">{f[7].value}</p>
								</div>
							</div>
						</div>
					</>
				)
			case Constants.TYPES.planets:
				return (
					<>
						<div className="row d-flex text-center my-auto sw-details-people0">
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-3 m-0 p-0 sw-colorize">{f[0].key}</p>
								<p className="fs-5">{f[0].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-4 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[1].key}</p>
									<p className="pe-3">{f[1].value}</p>
								</div>
								<div className="col-4 text-center">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[4].key}</p>
									<p>{f[4].value}</p>
								</div>
								<div className="col-4 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[3].key}</p>
									<p className="ps-3">{f[3].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[2].key}</p>
								<p>{f[2].value? "yes" : "no"}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[5].key}</p>
									<p className="pe-3">{f[5].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[6].key}</p>
									<p className="ps-3">{f[6].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[7].key}</p>
									<p className="pe-3">{f[7].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[8].key}</p>
									<p className="ps-3">{f[8].value}</p>
								</div>
							</div>
						</div>
					</>
				)
			case Constants.TYPES.species:
				return (
					<>
						<div className="row d-flex text-center my-auto sw-details-species0">
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-3 m-0 p-0 sw-colorize">{f[0].key}</p>
								<p>{f[0].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[1].key}</p>
									<p className="pe-3">{f[1].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[2].key}</p>
									<p className="ps-3">{f[2].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[3].key}</p>
									<p className="pe-3">{f[3].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[4].key}</p>
									<p className="ps-3">{f[4].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[5].key}</p>
								<p>{f[5].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-4 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[6].key}</p>
									<p className="pe-3">{f[6].value}</p>
								</div>
								<div className="col-4 text-center">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[7].key}</p>
									<p>{f[7].value}</p>
								</div>
								<div className="col-4 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[8].key}</p>
									<p className="ps-3">{f[8].value}</p>
								</div>
							</div>
						</div>
					</>
				)
			case Constants.TYPES.starships:
				return (
					<>
						<div className="row d-flex text-center my-auto sw-details-starships0">
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-3 m-0 p-0 sw-colorize">{f[0].key}</p>
								<p className="fs-5">{f[0].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[1].key}</p>
									<p className="pe-3">{f[1].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[2].key}</p>
									<p className="ps-3">{f[2].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[3].key}</p>
								<p>{f[3].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-4 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[4].key}</p>
									<p className="pe-3">{f[4].value}</p>
								</div>
								<div className="col-4 text-center">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[10].key}</p>
									<p>{f[10].value}</p>
								</div>
								<div className="col-4 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[11].key}</p>
									<p className="ps-3">{f[11].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-3 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[5].key}</p>
									<p className="pe-3">{f[5].value}</p>
								</div>
								<div className="col-5 text-center">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[6].key}</p>
									<p>{f[6].value}</p>
								</div>
								<div className="col-3 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[7].key}</p>
									<p className="ps-3">{f[7].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-4 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[8].key}</p>
									<p className="pe-3">{f[8].value}</p>
								</div>
								<div className="col-4 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[9].key}</p>
									<p className="ps-3">{f[9].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-3 m-0 p-0 sw-colorize">{f[12].key}</p>
								<p className="fs-5">{f[12].value}</p>
							</div>
						</div>
					</>
				)
			case Constants.TYPES.vehicles:
				return (
					<>
						<div className="row d-flex text-center my-auto sw-details-starships0">
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-3 m-0 p-0 sw-colorize">{f[0].key}</p>
								<p className="fs-5">{f[0].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-6 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[1].key}</p>
									<p className="pe-3">{f[1].value}</p>
								</div>
								<div className="col-6 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[2].key}</p>
									<p className="ps-3">{f[2].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[3].key}</p>
								<p>{f[3].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-4 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[4].key}</p>
									<p className="pe-3">{f[4].value}</p>
								</div>
								<div className="col-4 text-center">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[8].key}</p>
									<p>{f[8].value}</p>
								</div>
								<div className="col-4 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[9].key}</p>
									<p className="ps-3">{f[9].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[5].key}</p>
								<p>{f[5].value}</p>
							</div>
							<div className="row d-flex justify-content-between">
								<div className="col-4 text-end">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[6].key}</p>
									<p className="pe-3">{f[6].value}</p>
								</div>
								<div className="col-4 text-start">
									<p className="fw-bold fs-5 m-0 p-0 sw-colorize">{f[7].key}</p>
									<p className="ps-3">{f[7].value}</p>
								</div>
							</div>
							<div className="row d-flex justify-content-center">
								<p className="fw-bold fs-3 m-0 p-0 sw-colorize">{f[10].key}</p>
								<p className="fs-5">{f[10].value}</p>
							</div>
						</div>
					</>
				)
			default:
				return details.fields.map((e, i)=>
						<div key={`ed_${i}`} className="d-flex flex-column w-100">
							<p className="fw-bold fs-6 m-0 p-0 sw-colorize">{e.key}: </p>
							<p className="w-100 text-right">{e.value}</p>
						</div>
					)
		}
	}

	function _anyCard(){
		const k= Object.keys(details.cards)
		let i=0
		for(let t of k) i+= details.cards[t].length
		return i>0
	}

	function _composeCards(){

		const 
			k= Object.keys(details.cards)

		let i=0
		for(let t of k){
			i+= details.cards[t].length
		}

		if(i==0) return <></>

		return <>
				{
					k.map((l,i)=>
						<div key={`cl-${i}`} className="sw-cardlistcontainer">
							<span className="fw-bold ms-0 my-auto sw-wspre">{l.toUpperCase()} //</span>
							<div key={`cl-${i}`} className="sw-cardlistwrapper mt-2 mb-4">
								<div className="d-flex gap-4 p-3 sw-cardlist">
									{
										details.cards[l].map((e,i2)=> {
											let ent= actions.getEntityFromIID(e)
											return <EntityCard key={`cl-${i}-${i2}`} entity={ent} show={true} cb_click={()=>{}}/>
										}
										)
									}
								</div>
							</div>
						</div>
					)

				}
			</>
	}

}

export default Detail
