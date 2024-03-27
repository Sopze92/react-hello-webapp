
const API= "https://www.swapi.tech/api"

const storeState = ({ get, set }) => {
	return {
		ready: false, // tells us wether we can fetch data from the api or not
		store: {},
		actions: {

			/** load/get API urls and the entire entity list */
			initialize: async ()=>{

				// using sessionStorage instead localStorage because I dont wanna store permanent data in my device for this
				const 
					api_paths= _getFromSessionStorage("ss_apiStore"),
					api_store= _getFromSessionStorage("ss_apiStore")

				let resdata
				
				set.ready(false)

				// fetch paths and save (if not saved)
				if(Object.keys(api_paths).length == 0) {
					try {
						resdata= await (await fetch(`${API}`, { method: "GET", headers: { "Content-Type": "application/json" } })).json()
						for(const d in resdata.result) api_paths[d] = resdata.result[d].match(/\/[a-zA-Z0-9]+$/)[0]
					}
					catch(e){console.error(e)}
				}

				// fecth every object list and save (if not saved) (no item details will be fetched)
				if(Object.keys(api_store).length == 0) {
					try {
						for(const p in api_paths){
							resdata= await (await fetch(`${API}/${p}?page=1&limit=0xFFFFFFFF`)).json() // this query params ensure we get all the elements of a kind in a single fetch
							api_store[p]= resdata.results?? resdata.result
						}
					}
					catch(e) {console.error(e)}
				}

				if(Object.keys(api_paths).length > 0 && Object.keys(api_store).length > 0){
					window.sessionStorage.setItem("ss_apiPaths", JSON.stringify(api_paths))
					window.sessionStorage.setItem("ss_apiStore", JSON.stringify(api_store))
					set.store(api_store)
					set.ready(true)
				}
			},

			filter: (idx)=> {
				console.log(idx)
			}
		}
	}

	// helpers

	function _getFromSessionStorage(name){
		let raw= window.sessionStorage.getItem(name)
		return raw? JSON.parse(raw) : {}
	}
}

export default storeState;
