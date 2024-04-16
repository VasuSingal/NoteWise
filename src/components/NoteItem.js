import React, {useContext} from 'react'
import noteContext from "../context/notes/noteContext"

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const {deleteNote} = context;
    const { note, setNote } = props

    const handleDeleteClick = () => {
        deleteNote(note._id)
    }

    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5> 
                        <i className="fa-solid fa-trash-can mx-2" onClick={handleDeleteClick}></i>
                        <i className="fa-solid fa-pen-to-square mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>{setNote({id: note._id, etitle: note.title, edescription: note.description, etag: note.tag})}}></i>
                    </div>
                    <h6 className="card-subtitle mb-2 text-body-secondary">{note.tag}</h6>
                    <p className="card-text">{note.description}</p>
                    <a href="/" className="card-link">Card link</a>
                    <a href="/" className="card-link">Another link</a>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
