import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import PatientsTable from './PatientsTable';

export default function Patients() {

    const [onFetch, setOnFetch] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [allPatients, setAllPatients] = useState([]);
    const [filterBy, setFilterBy] = useState("");
    const [filterByValue, setFilterByValue] = useState("");


    const navigate = useNavigate();
    async function addPatient() {
        navigate('add')
    }

    function filterPatients() {
        setFilterByValue(filterInput.value);
        filterInput.value = "";
    }

    useEffect(() => {
        const getPatients = async () => {
            try {
                setOnFetch(true);
                const response = await fetch(`http://localhost:2025/patients`);
                if (!response.ok) throw "Did not recieved excepted data.";
                const patients = await response.json();
                setOnFetch(false);
                setAllPatients(patients);
                setFetchError(null);
            }
            catch (err) {
                setFetchError(err.message);
            }
        }
        getPatients();
    }, [])


    return (
        <div>
            {onFetch && <h1>Loading Patients...</h1>}
            {!onFetch && <div>
                <div style={{ display: "flex", margin: "2vw", justifyContent: "space-between", height: "auto", alignItems: 'flex-end' }}>
                    <button onClick={addPatient}>Add Patient</button>
                    <div style={{marginLeft:'15vw'}}>
                        <label htmlFor="filters"><b>Filter By: </b></label>
                        <div id="filtering" style={{ display: 'flex' }} >
                            <select
                                name="filters"
                                id="filters"
                                style={{ width: '10vw', marginRight: '1vw' }}
                                onChange={e => {
                                    if (e.target.value == "")
                                        setFilterByValue("");
                                    else setFilterBy(e.target.value)
                                }}>
                                <option selected={filterBy == ""} value="">All</option>
                                <option selected={filterBy == "id"} value="id">Id</option>
                                <option selected={filterBy == "name"} value="name">Name</option>

                            </select>
                            <input id="filterInput" placeholder="enter id or name" ></input>
                            <p onClick={filterPatients} style={{margin:"1vw"}} className='pBtn'>🔍</p>
                        </div>
                    </div>
                </div>
                <PatientsTable setAllPatients={setAllPatients} allPatients={allPatients} filterBy={filterBy} filterByValue={filterByValue} />
            </div>}
        </div>
    )
}