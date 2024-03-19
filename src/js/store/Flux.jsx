
const API= {
	url: "https://playground.4geeks.com/apis/fake/contact/",
	agenda: "agenda/",
	agenda_slug: "sergiosopze_mondongo_psicoactivo_aka_shu_moreniikoh_19_x69x_tula27cm_larga_y_dura_como_la_vida_estudias_o_trabajas_su_tabaco_gracias_vuelva_pronto" // sin comentarios
}

const agendaState = ({ getAgenda, getActions, setAgenda }) => {
	return {
		agenda: [],
		actions: {

			// load agenda from server
			loadAgenda: (replace=false)=>{
				// get agenda directory to safely check if ours exist
				fetch(`${API.url}${API.agenda}`, { method: "GET", headers: { "Content-Type": "application/json" } })
				.then(res => res.json())
				.then(dir => {
					// if user exists, get agenda
					if(dir.includes(API.agenda_slug)){
						fetch(`${API.url}${API.agenda}${API.agenda_slug}`, {
							method: "GET",
							headers: { "Content-Type": "application/json" }
						})
						.then(res=> res.json())
						.then(data=> {	
							console.log("agenda loaded")
							setAgenda(data, replace)
						})
					}
				})
				.catch(e=> console.error(e))
			},

			// clear the entire agenda
			clearAgenda: ()=> {
				fetch(`${API.url}${API.agenda}${API.agenda_slug}`, { method: "DELETE" })
				.then(()=>{ 
					console.log("agenda cleared")
					getActions().loadAgenda(true) 
				})
				.catch(e=> console.error(e))
			},

			// create OR update contact
			setContact: (contact)=>{
				// ---------------------------- create/update (update if 'id' property is present, as only existent contacts have it)
				fetch(`${API.url}${contact.id??""}`, {
					method: contact.id ? "PUT" : "POST", // update PUT, create POST
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...contact, agenda_slug: API.agenda_slug })
				})
				.then(()=>{ 
					console.log(`contact ${contact.id ? "edited" : "added"}`)
					getActions().loadAgenda() 
				})
				.catch(e=> console.error(e) )
			},

			// get contact
			getContact: (id)=> getAgenda().find(e=>e.id==id),

			// remove contact
			removeContact: (id)=> {
				fetch(`${API.url}${id}`, { method: "DELETE" })
				.then(()=>{
					console.log("contact removed")
					getActions().loadAgenda(true)
				})
				.catch(e=>console.error(e))
			}
		}
	};
};

export default agendaState;
