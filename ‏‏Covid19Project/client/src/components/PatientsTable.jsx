import { useState } from 'react'
import RowInPatientsTable from './RowInPatientsTable';

export default function PatientsTable(props) {
    const [fetchError, setFetchError] = useState(null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {fetchError && <h1 style={{ color: "red" }}>Error:<br /> {fetchError}</h1>}
            { props.allPatients.length ==0&&<h1>No Patients Found</h1>}
            {!fetchError && props.allPatients.length > 0 && <table >
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {props.allPatients.map((patient) => {
                        if (props.filterBy === "id" && props.filterByValue != "" && patient.id == props.filterByValue)
                            return <RowInPatientsTable patient={patient} setFetchError={setFetchError} key={patient.id} setAllPatients={props.setAllPatients} allPatients={props.allPatients} />
                        else if (props.filterBy === "name" && props.filterByValue != "" && patient.name == props.filterByValue)
                            return <RowInPatientsTable patient={patient} setFetchError={setFetchError} key={patient.id} setAllPatients={props.setAllPatients} allPatients={props.allPatients} />
                        else if (props.filterByValue === "")
                            return <RowInPatientsTable patient={patient} setFetchError={setFetchError} key={patient.id} setAllPatients={props.setAllPatients} allPatients={props.allPatients} />
                    })}
                </tbody>
            </table>}
        </div>
    )
}