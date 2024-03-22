
const API= {
	base: "https://www.swapi.tech/api",
}

const storeState = ({ get, set }) => {
	return {
		ready: false, // tells us wether we can fetch data from the api or not
		store: [],
		actions: {

			initialize: ()=>{

				// using sessionStorage instead localStorage because I dont wanna store permanent data in my device for this
				const api_paths= window.sessionStorage.getItem("ss_apiPaths")

				// read paths if saved, fetch them otherwise
				if(api_paths) __applyPaths(JSON.parse(api_paths))
				else {
					set.ready(false)
					fetch(`${API.base}`, { method: "GET", headers: { "Content-Type": "application/json" } })
					.then(res => res.json())
					.then(dir => {
						const paths= structuredClone(dir.result)
						for(const d in paths) paths[d] = paths[d].match(/\/[a-zA-Z0-9]+$/)[0]
						__applyPaths(paths)
					})
					.catch(e=> console.error(e))
				}

				// apply paths either from fetch or storage, and save them if not yet
				function __applyPaths(paths){
					for(const d in paths) API[d]= paths[d]
					if(!api_paths) window.sessionStorage.setItem("ss_apiPaths", JSON.stringify(paths))
					set.ready(true)
				}
			}
		}
	};
};

export default storeState;
