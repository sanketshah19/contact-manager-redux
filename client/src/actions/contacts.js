import axios from '../config/axios';
import swal from 'sweetalert';

export const getAllContacts = (contacts) => {
    return {
        type: 'GET_ALL_CONTACTS',
        payload: contacts
    }
}

export const addContact = (contact) => {
    return {
        type: 'ADD_CONTACT',
        payload: contact
    }
}

export const getSingleContact = (contact) => {
    return {
        type: 'SINGLE_CONTACT',
        payload: contact
    }
}

export const editContact = (contact) => {
    return {
        type: 'EDIT_CONTACT',
        payload: contact
    }
}

export const deleteContact = (id) =>{
    return {
        type: 'REMOVE_CONTACT',
        payload: id
    }
}

export const searchContact = (data) => {
    return {
        type:"SEARCH_CONTACT",
        payload:data
    }
}

export const startGetAllContacts = () => {
    return (dispatch) => {
        axios.get('/contacts', {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
        .then((response) => {
            const contacts = response.data
            dispatch(getAllContacts(contacts))
        })
        .catch((err) => {
            swal ("Oops", `${err}` ,"error")
        })
    }
}

export const startAddContact = (formData, props) => {
    return (dispatch) => {
        axios.post('/contacts', formData, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
        .then((response) => {
            if(response.data.hasOwnProperty('errmsg')){
                if(response.data.name === "MongoError" && response.data.code === 11000){
                    swal ("Oops", `${Object.keys(response.data.keyValue)} already exists` ,"error")
                }
            }else if(response.data.hasOwnProperty('errors')){
                swal("Oops!", `${response.data.message}`, "error")
            }else{
                swal("Success!", "Contact Created Successfully!", "success")
                props.history.push('/contacts')
                dispatch(addContact(response.data))
            }
        })
        .catch((err) => {
            swal("Oops!", `${err}`, "error");
        })
    }
}

export const startGetSingleContact = (id) => {
    return (dispatch) => {
        axios.get(`/contacts/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
        .then((response) =>{
            const contact = response.data
            dispatch(getSingleContact(contact))
        })
        .catch((err) => {
            swal ("Oops", `${err}` ,"error")
        })
    }
}

export const startEditContact = (formData, id, props) => {
    return (dispatch) => {
        axios.put(`/contacts/${id}`, formData, {
                    headers: {
                        'x-auth': localStorage.getItem('authToken')
                    }
                })
                .then((response) => {
                    if(response.data.hasOwnProperty('errmsg')){
                        if(response.data.name === "MongoError" && response.data.code === 11000){
                            swal ("Oops", `${Object.keys(response.data.keyValue)} already exists` ,"error")
                        }
                    }else if(response.data.hasOwnProperty('errors')){
                        swal("Oops!", `${response.data.message}`, "error")
                    }else{
                        swal("Success!", "Details Updated Successfully!", "success")
                        dispatch(editContact(response.data))
                        props.history.push('/contacts')
                    }
                })
                .catch((err) => {
                    swal ("Oops", `${err}` ,"error")
                })
    }
}

export const startDeleteContact = (id) => {
    return (dispatch) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this contact!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                axios.delete(`/contacts/${id}`, {
                    headers: {
                        'x-auth': localStorage.getItem('authToken')
                    }
                })
                .then((response) => {
                    if(response.data.hasOwnProperty('errors')){
                        swal("Oops!", `${response.data.message}`, "error");
                    }else{
                        swal("Poof! Your contact has been deleted!", {
                            icon: "success",
                          })
                        dispatch(deleteContact(id))
                    }
                })
                .catch((err) => {
                    swal ("Oops", `${err}` ,"error")
                })
            }
          })
    }
}

export const startSearchContact = (value) => {
    return (dispatch) => {
        axios.get('/contacts', {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then((response) => {
                const data = response.data.filter((contact) => {
                    return (contact.name.toLowerCase().slice(0, value.length) === value.toLowerCase() || contact.mobile.toString().slice(0, value.length) === value)
                })
                dispatch(searchContact(data))
            })
    }
}