const { nanoid } = require('nanoid');
const notes = require('./notes')

const addNoteHandler = (request, h)=>{
    const { tittle, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        tittle, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note)=>note.id === id).length > 0;

    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.status(500);
    return response;
};

const getAllNotesHandler = ()=>{
    return {status: 'success',
    data: {
        notes,
    }}
};

const getNoteByIdHandler = (request, h)=>{
    const { id } = request.params;

    const note = notes.filter((n)=>n.id === id)[0];

    if(note){
        return {
            status: 'success',
            data: {
                note,
            },
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan Tidak Ditemukan',
    });
    response.code(404);
    return response;
}

const editNoteByIdHandler = (request, h)=>{
    const { id } = request.params;
    const { tittle, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note)=>note.id === id);

    if(index !== -1){
        notes[index]={
            ...notes[index],
            tittle,
            tags,
            body,
            updatedAt,
        }
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. ID tidak ditemukan'
    });
    response.code(404);
    return response;

}

const deleteNoteByIdHandler = (request, h)=>{
    const { id } = request.params;
    const index = notes.findIndex((note)=>note.id === id);

    if(index !== -1){
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus, ID tidak ditemukan',
    });
    response.code(404);
    return response;
}
module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };