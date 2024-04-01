
const API= "https://www.swapi.tech/api"

export const Constants= Object.freeze({
	TYPES: { all:0, films:1, people:2, planets: 3, species:4, starships:5, vehicles:6 },
	TYPE_COUNT: 7,
	PICTURE_STATE: { unchecked:0, enabled:1, disabled:2 },
	TYPE_DATA: [
		{
			name: "all", filter: null, picture: null, label: "All", color: "#877",
			props: null
		},
		{
// 		card name     api name 					picture path 			menu name 			some css color
			name: "film",	filter: "films",	picture: "films", label: "Films", color: "#f6ed44",
			// details view fields
			props: {
				include: [
					{ key: "title", 					label: "Title" },
					{ key: "episode_id", 			label: "Episode" },
					{ key: "director", 				label: "Director" },
					{ key: "producer", 				label: "Producer" },
					{ key: "release_date", 		label: "Release Date" },
					{ key: "opening_crawl", 	label: "Opening Crawl" }
				],
				// details view subtypes
				cards: ["characters:people", "planets", "species", "starships", "vehicles"]
			}
		},
		{
			name: "character", filter: "people", picture: "characters", label: "People", color: "#d23f1e",
			props: {
				include: [
					{ key: "name", 				label: "Name" },
					{ key: "birth_year", 	label: "Birth Year" },
					{ key: "gender", 			label: "Gender" },
					{ key: "height", 			label: "Height" },
					{ key: "mass", 				label: "Mass" },
					{ key: "skin_color", 	label: "Skin Color" },
					{ key: "hair_color", 	label: "Hair Color" },
					{ key: "eye_color", 	label: "Eye Color" }
				],
				cards: ["homeworld:planets"]
			}
		},
		{
			name: "planet", filter: "planets", picture: "planets", label: "Planets", color: "#d77e39",
			props: {
				include: [
					{ key: "name", 							label: "Name" },
					{ key: "population", 				label: "Population" },
					{ key: "surface_water", 		label: "Surface Water" },
					{ key: "climate", 					label: "Climate" },
					{ key: "terrain", 					label: "Terrain" },
					{ key: "gravity", 					label: "Gravity" },
					{ key: "diameter", 					label: "Diameter" },
					{ key: "rotation_period", 	label: "Rotation Period" },
					{ key: "orbital_period", 		label: "Orbital Period" }
				],
				cards: []
			}
		},
		{
			name: "species", filter: "species", picture: "species", label: "Species", color: "#3ad468",
			props: {
				include: [
					{ key: "name", 							label: "Name" },
					{ key: "designation", 			label: "Designation" },
					{ key: "classification", 		label: "Classification" },
					{ key: "average_lifespan", 	label: "Average Lifespan" },
					{ key: "average_height", 		label: "Average Height" },
					{ key: "language", 					label: "Language" },
					{ key: "skin_colors", 			label: "Skin Color" },
					{ key: "hair_colors", 			label: "Hair Color" },
					{ key: "eye_colors", 				label: "Eye Color" }
				],
				cards: ["homeworld:planets", "people"]
			}
		},
		{
			name: "starship", filter: "starships", picture: "starships", label: "Starships", color: "#b45fee",
			props: {
				include: [
					{ key: "name", 										label: "Name" },
					{ key: "manufacturer", 						label: "Manufacturer" },
					{ key: "model", 									label: "Model" },
					{ key: "starship_class", 					label: "Class" },
					{ key: "length", 									label: "Length" },
					{ key: "max_atmosphering_speed",	label: "Max Speed" },
					{ key: "hyperdrive_rating", 			label: "Hyperdrive Rating" },
					{ key: "MGLT", 										label: "MGLT" },
					{ key: "crew", 										label: "Crew" },
					{ key: "passengers", 							label: "Passengers" },
					{ key: "cargo_capacity", 					label: "Cargo Capacity" },
					{ key: "consumables", 						label: "Consumables" },
					{ key: "cost_in_credits", 				label: "Price" }
				],
				cards: ["pilots:people"]
			}
		},
		{
			name: "vehicle", filter: "vehicles", picture: "vehicles", label: "Vehicles", color: "#5aeff7",
			props: {
				include: [
					{ key: "name", 										label: "Name" },
					{ key: "manufacturer", 						label: "Manufacturer" },
					{ key: "model", 									label: "Model" },
					{ key: "vehicle_class", 					label: "Class" },
					{ key: "length", 									label: "Length" },
					{ key: "max_atmosphering_speed",	label: "Max Speed" },
					{ key: "crew", 										label: "Crew" },
					{ key: "passengers", 							label: "Passengers" },
					{ key: "cargo_capacity", 					label: "Cargo Capacity" },
					{ key: "consumables", 						label: "Consumables" },
					{ key: "cost_in_credits", 				label: "Price" }
				],
				cards: ["pilots:people", "films"]
			}
		}
	]
})

const storeState = ({ get, set }) => {
	return {
		ready: { state: false },
		radial: { state: false },
		store: {},
		thumbs: {},
		bookmarks: { store: [] },
		filter: { index: 0 },
		actions: {

			testFile: async (url)=> (await fetch(url, { method: "HEAD" })).status=== 200,

			/** load/get API urls and the entire entity list */
			setup: async (enableStorage=true)=>{

				set.ready({ state: false })

				// using sessionStorage basic api lists, localStorage for bookmarks
				const 
					api_paths= enableStorage ? _getFromSessionStorage("ss_apiPaths") : {},
					api_store= enableStorage ? _getFromSessionStorage("ss_apiStore") : {},
					bookmarks= _getFromLocalStorage("ls_bookmarks")

				// fetch per-type paths
				if(Object.keys(api_paths).length == 0) {
					try {
						let resdata= await (await fetch(`${API}`, { method: "GET", headers: { "Content-Type": "application/json" } })).json()
						for(const d in resdata.result) api_paths[d] = resdata.result[d].match(/\/[a-zA-Z0-9]+$/)[0]
					}
					catch(e){console.error(e)}
				}

				// fecth every object list (no item details)
				if(Object.keys(api_store).length == 0) {

					 // this way all fetchs start at once (doing one-by-one is slow, as swapi takes up to 3s to respond to each request)
					const 
						query= "?page=1&limit=0xFFFFFFFF",	// this query ensures we get all the elements of each type in a single fetch
						temp_store= {},
						promises= []

					for(const p in api_paths) {
						promises.push( new Promise(async(yes,no)=>{
							try {
								const resdata= await (await fetch(`${API}/${p}${query}`)).json()
								temp_store[p]= resdata.results?? resdata.result
								yes()
							}
							catch(e) {
								console.error(e) 
								temp_store[p]=[]
								no() 
							}
						}))
					}
						
					await Promise.all(promises)

					// fetchs can mess the databank order, so set keys to final api_store in correct order (films, people, planets, species, starships, vehicles)
					for(const p in api_paths) api_store[p]= temp_store[p]??[]
				}

				if(Object.keys(api_paths).length > 0 && Object.keys(api_store).length > 0){

					for(const t in api_store) {

						const
							f= Constants.TYPES[t],
							td= Constants.TYPE_DATA[f]

					// add extra data to each element
						api_store[t].forEach((e)=> {
							e.iid= `${f}_${e.uid}`
							e.type= { index: f, name: td.name, filter: td.filter }
							e.thumb= `${td.picture}/${e.uid}.jpg`
							if(e.type.index===1) e.name= e.properties.title // fix films name not being on object's root
							e.query= `${t}\0${td.filter}\0${td.name}\0${td.picture}\0${e.name}`.toLowerCase()
						})
					}

					// thumbs
					const thumbs= enableStorage ? get.thumbs() : {}
					if(Object.keys(thumbs).length === 0){
						for(const t in api_store) {
							for(const e of api_store[t]) thumbs[e.iid]= Constants.PICTURE_STATE.unchecked
						}
					}
					
					// fix bookmark object if empty
					if(Object.keys(bookmarks).length == 0) { bookmarks.store= [] }

					// save and apply
					window.sessionStorage.setItem("ss_apiPaths", JSON.stringify(api_paths))
					window.sessionStorage.setItem("ss_apiStore", JSON.stringify(api_store))
					set.thumbs(thumbs)
					set.store(api_store)
					set.bookmarks(bookmarks)
					set.ready({ state: true })
					get.actions().filterStore(0)
				}
			},

			filterStore: (idx)=> {

				if(!get.ready()) set.filter({ index: -1, store: [] })

				const 
					fullStore= get.store(),
					filteredStore= []

				if(!idx) for(const t in fullStore) for(const e of fullStore[t]) filteredStore.push(e.iid)
				else for(const e of fullStore[Constants.TYPE_DATA[idx].filter]) filteredStore.push(e.iid)

				set.filter({ index: idx, store: filteredStore })
			},

			getEntity: (type, uid)=> get.store()[type].find(e=>e.uid==uid),
			getEntityFromIID: (iid)=> {
				const 
					[ t, i ]= iid.split(`_`),
					type= Constants.TYPE_DATA[Number(t)>>>0].filter,
					index= Number(i)>>>0

				return get.actions().getEntity(type, index)
			},

			getEntityDetails: async (entity)=> {
				try {
					const 
						resdata= await (await fetch(`${entity.url}`, { method: "GET", headers: { "Content-Type": "application/json" } })).json(),
						_entity= resdata.result

					_entity.type= entity.type

					return await get.actions().parseEntityProperties(_entity)
				}
				catch(e){console.error(e)}
			},

			parseEntityProperties: async (entity)=> {
				const
					props= entity.properties,
					typeprops= Constants.TYPE_DATA[entity.type.index].props,
					fields= [], cards= {}

				for(const e of typeprops.include) fields.push({ key: e.label, value: props[e.key]} )

				for(const e of typeprops.cards) {
						const 
							[ st_key, st_type ]= e.includes(':')? e.split(':') : [ e, e ],
							st_index= Constants.TYPES[st_type],
							st_entities= []
						
							if(Array.isArray(props[st_key])){
								for(const c of props[st_key]) st_entities.push(`${st_index}_${c.match(/\/([0-9]+)$/)[1]}`)
							}
							else st_entities.push(`${st_index}_${props[st_key].match(/\/([0-9]+)$/)[1]}`)

							cards[st_key]= st_entities
				}

				return { fields, cards }
			},

			getPictureState: (entity)=> get.thumbs()[entity.iid],
			setPictureState: (entity, state)=> {
				const newThumbs= structuredClone(get.thumbs())
				newThumbs[entity.iid]= state
				set.thumbs(newThumbs)
			},

			isBookmarked: (entity)=> get.bookmarks().store.includes(entity.iid),
			toggleBookmark: (entity)=> {
				const 
					bookmarks= get.bookmarks(),
					anyBookmark= bookmarks.store.length > 0,
					index= bookmarks.store.indexOf(entity.iid)

				let bookmarksStore= []
				
				if(index < 0) {
					if(anyBookmark) bookmarksStore.push(...bookmarks.store)
					bookmarksStore.push(entity.iid)
				}
				else if(anyBookmark) bookmarksStore.push(...bookmarks.store.filter(e=>e!=entity.iid))

				let newBookmarks= {store: bookmarksStore};

				set.bookmarks(newBookmarks)
				window.localStorage.setItem("ls_bookmarks", JSON.stringify(newBookmarks))
			},

			setRadialState: (state)=> set.radial({ state: state })
		}
	}

	// helpers

	function _getFromSessionStorage(name){
		let raw= window.sessionStorage.getItem(name)
		return raw? JSON.parse(raw) : {}
	}

	function _getFromLocalStorage(name){
		let raw= window.localStorage.getItem(name)
		return raw? JSON.parse(raw) : {}
	}
}

export default storeState;
