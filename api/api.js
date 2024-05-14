import api from "./axios"

export const getPersons = async () => {
    try {
        const  response = await api.get('/persons');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createPerson = async (data) => {
    try {
        const response = await api.post('/persons', data);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }

}

export const updatePerson = async (data) => {
    try {
        const response = await api.put(`/persons/${data.ID}`, data);
        // console.log(response.data);
        return response;
    } catch (error) {
        console.error(error);
    }

}

export const getMedicamentos = async () => {
    try {
        const response = await api.get('/medications');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createMedicamento = async (data) => {
    try {
        const response = await api.post('/medications', data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateMedicamento = async (data) => {
    try {
        const response = await api.put(`/medications/${data.ID}`, data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const getReceta = async(id)=>{
    try {
        const response = await api.get(`/prescriptions/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const createReceta = async (data)=>{
    try {
        const response = await api.post('/prescriptions', data);
        return response.data;
    } catch (error) {
        console.error(error);
        console.log(error)
    }
}

export const getDosages = async(id)=>{
    try {
        const response = await api.get(`/dosages/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createDosage = async(data)=>{
    try {
        const response = await api.post('/dosages', data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateDosage = async(data)=>{
    try {
        const response = await api.put(`/dosages/${data.ID}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteDosage = async(id)=>{
    try {
        const response = await api.delete(`/dosages/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}