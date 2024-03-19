import React from "react";

import { Context } from "../store/AppContext.jsx"

const RemoveModal= ({ contactid, cb_OnClose })=>{
  
  const
    { actions } = React.useContext(Context),
    contact= actions.getContact(contactid)

  if(!contact) handleButton(0) // cancel if no contact, though this should never happen

  function handleButton(bid) {
    if(bid===1) actions.removeContact(contactid)
    cb_OnClose()
  }

  return (
    <div className="modal cl-modal" style={{display: "flex"}}> 
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm deletion</h5>
          </div>
          <div className="modal-body">
            <p><span className="cl-removalname">{contact.full_name}</span> will be gone forever</p>
            <p>this action <b>cannot</b> be undone!</p>
          </div>
          <div className="modal-footer">
            <button onClick={()=>handleButton(0)} type="button" className="btn btn-secondary">Cancel</button>
            <button onClick={()=>handleButton(1)} type="button" className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default RemoveModal