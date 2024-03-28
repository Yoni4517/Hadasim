
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import UpdatePatient from './UpdatePatient';

export default function SinglePatientDetails() {

    const [patient, setPatient] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [onFetch, setOnFetch] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const convertDateFormat = (dateString) => {
        if(dateString==null)
             return null;
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    };

    function castingDatesToNormalForm(patient) {
        let p = {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            birthDate: convertDateFormat(patient.birthDate),
            phone: patient.phone,
            cellphone: patient.cellphone,
            street: patient.street,
            city: patient.city,
            houseNumber: patient.houseNumber,
            positiveResultDate: !patient.positiveResultDate ? null : convertDateFormat(patient.positiveResultDate),
            recoveryDate: !patient.recoveryDate ? null : convertDateFormat(patient.recoveryDate),
            vaccines: {
                vac1: patient.vaccines.vac1 ? {
                    date: !patient.vaccines.vac1 ? null : convertDateFormat(patient.vaccines.vac1.date),
                    manufacturer: !patient.vaccines.vac1 ? null : patient.vaccines.vac1.manufacturer
                } : null,
                vac2: patient.vaccines.vac2 ? {
                    date: !patient.vaccines.vac2 ? null : convertDateFormat(patient.vaccines.vac2.date),
                    manufacturer: !patient.vaccines.vac2 ? null : patient.vaccines.vac2.manufacturer
                } : null,
                vac3: patient.vaccines.vac3 ? {
                    date: !patient.vaccines.vac3 ? null : convertDateFormat(patient.vaccines.vac3.date),
                    manufacturer: !patient.vaccines.vac3 ? null : patient.vaccines.vac3.manufacturer
                } : null,
                vac4: patient.vaccines.vac4 ? {
                    date: !patient.vaccines.vac4 ? null : convertDateFormat(patient.vaccines.vac4.date),
                    manufacturer: !patient.vaccines.vac4 ? null : patient.vaccines.vac4.manufacturer
                } : null,
            }
        }
        return p;
    }
    useEffect(() => {
        const getPatient = async () => {
            try {
                setOnFetch(true);
                const response = await fetch(`http://localhost:2025/patients/${id}`);
                if (!response.ok) throw "Did not recieved excepted data.";
                let p = await response.json();
                console.log(p);
                p = castingDatesToNormalForm(p);
                console.log(p);
                setPatient(p);
                setOnFetch(false);
                setFetchError(null);
            }
            catch (err) {
                setFetchError(err.message);
            }
        }
        getPatient();
    }, [])

    async function updatePatient() {
        setUpdateMode(true);
    }

    async function deletePatient() {
        let toDelete = confirm(`Are You Shure that You Want To Delete Patient number ${id}?`);
        if (toDelete) {
            try {
                const response = await fetch(`http://localhost:2025/patients/${id}`,
                    {
                        method: 'DELETE',
                    });
                if (!response.ok) throw "Did not recieved excepted data.";
                props.setFetchError(null);
            }
            catch (err) {
                setFetchError(err.message);
            }
            navigate('/patients');
        }
    }

    return (
        <div>
            <button className="upperLeftButton" onClick={() => { navigate('/patients') }}> ⬅ Back </button>
            {!updateMode && <div>
                {!patient && <h1>Loading Details of Patient {id}...</h1>}
                {patient &&
                    <div style={{ textAlign: 'start' }}>
                        <button onClick={updatePatient}>Update</button>
                        <button onClick={deletePatient}>Delete</button>
                        <h1>Details of patient {id}:</h1>
                        <p>Id: {patient.id}</p>
                        <p>Name: {patient.firstName} {patient.lastName}</p>
                        <p>Birth Date: {patient.birthDate}</p>
                        <p>Phone Number: {patient.phone}</p>
                        <p>Cellphone Number: {patient.cellphone}</p>
                        <h4>Address:</h4>
                        <p>City: {patient.city}</p>
                        <p>Street: {patient.street}</p>
                        <p>House Number: {patient.houseNumber}</p>
                        <br></br>
                        <h3>Covid-19</h3>
                        <h4>Vaccines:</h4>
                        {patient.vaccines.vac1 && <p>Vaccination 1:&nbsp;&nbsp;&nbsp;&nbsp; Date: {patient.vaccines.vac1.date}  &nbsp;&nbsp;&nbsp;&nbsp; Manufacturer: {patient.vaccines.vac1.manufacturer}</p>}
                        {patient.vaccines.vac2 && <p>Vaccination 2:&nbsp;&nbsp;&nbsp;&nbsp; Date: {patient.vaccines.vac2.date}  &nbsp;&nbsp;&nbsp;&nbsp; Manufacturer: {patient.vaccines.vac2.manufacturer}</p>}
                        {patient.vaccines.vac3 && <p>Vaccination 3:&nbsp;&nbsp;&nbsp;&nbsp; Date: {patient.vaccines.vac3.date}  &nbsp;&nbsp;&nbsp;&nbsp; Manufacturer: {patient.vaccines.vac3.manufacturer}</p>}
                        {patient.vaccines.vac4 && <p>Vaccination 4:&nbsp;&nbsp;&nbsp;&nbsp; Date: {patient.vaccines.vac4.date}  &nbsp;&nbsp;&nbsp;&nbsp; Manufacturer: {patient.vaccines.vac4.manufacturer}</p>}
                        <br></br>
                        {patient.positiveResultDate && <p>Date of receiving a positive result: {patient.positiveResultDate}</p>}
                        {patient.recoveryDate && <p>Date of Recovery: {patient.recoveryDate}</p>}
                    </div>}
            </div>}
            {updateMode && <UpdatePatient patient={patient} setUpdateMode={setUpdateMode} />}
        </div>
    )
}