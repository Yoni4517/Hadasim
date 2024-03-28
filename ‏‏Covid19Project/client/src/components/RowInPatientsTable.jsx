import { useNavigate } from 'react-router-dom';

export default function RowInPatientsTable(props) {
    const navigate = useNavigate();
   
    function seeFullDetails(id) {
        navigate(`${id}`)
    }
    return (
        <tr key={props.patient.id} onClick={() => { console.log(props.patient.id); seeFullDetails(props.patient.id) }} className="patientTr" >
            <td>{props.patient.id}</td>
            <td>{props.patient.firstName} {props.patient.lastName}</td>
        </tr>
    )
}