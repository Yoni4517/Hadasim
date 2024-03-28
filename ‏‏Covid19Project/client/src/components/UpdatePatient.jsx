import { useState } from "react";

export default function UpdatePatient(props) {
    const [fetchError, setFetchError] = useState(null);
    let p = props.patient;
    function handleChange(event) {
        event.target.className = "onChange";
    }
    async function onSubmit(e) {
        e.preventDefault();
        let patientDetails = {
            id: id.value,
            firstName: firstName.value,
            lastName: lastName.value,
            birthDate: birthDate.value,
            phoneNumber: phoneNumber.value,
            cellphoneNumber: cellphoneNumber.value,
            street: street.value,
            city: city.value,
            houseNumber: houseNamber.value,
            positiveResultDate: positiveResultDate.value==''?null:positiveResultDate.value,
            recoveryDate: recoveryDate.value==''?null:recoveryDate.valu,
            vaccines: {
                vac1: {
                    date: dateVac1.value == '' ? null : dateVac1.value,
                    manufacturer: manufacturer1.value
                },
                vac2: {
                    date: dateVac2.value == '' ? null : dateVac2.value,
                    manufacturer: manufacturer2.value
                },
                vac3: {
                    date: dateVac3.value == '' ? null : dateVac3.value,
                    manufacturer: manufacturer3.value
                },
                vac4: {
                    date: dateVac4.value == '' ? null : dateVac4.value,
                    manufacturer: manufacturer4.value
                },
            }
        }

        try {
            const response = await fetch(`http://localhost:2025/patients/${id.value}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(patientDetails),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
            if (!response.ok) throw "Updating the patient was failed";
            window.location.reload();
            setFetchError(null);
        }
        catch (err) {
            setFetchError(err.message);
        }
    }

    return (
        <form onSubmit={onSubmit} style={{ textAlign: 'start' }} >
            <div className="formDiv" >
                <p onClick={() => { props.setUpdateMode(false); }} className="pBtn" >✖</p>
                <h2 style={{ color: " #023047" }}>Update Patient Details:</h2>
                <label htmlFor="id">Id</label>
                <input readOnly defaultValue={p.id} type="text" id="id" pattern="[0-9]{7,9}" required />
                <label htmlFor="firstName">First Name</label>
                <input onChange={handleChange} defaultValue={p.firstName} type="text" id="firstName" pattern="[א-תa-zA-Z\s]{2,25}" required />
                <label htmlFor="lastName">Last Name</label>
                <input onChange={handleChange} defaultValue={p.lastName} type="text" id="lastName" pattern="[א-תa-zA-Z\s]{2,25}" required />
                <label htmlFor="birthDate">Birth Date</label>
                <input onChange={handleChange} defaultValue={p.birthDate} type="date" id="birthDate" required />
                <label htmlFor="phoneNumber">Phone Number</label>
                <input onChange={handleChange} defaultValue={p.phone} type="tel" id="phoneNumber" required />
                <label htmlFor="cellphoneNumber">Cellphone Number</label>
                <input onChange={handleChange} defaultValue={p.cellphone} type="tel" id="cellphoneNumber" required />
                <p>Address:</p>
                <label htmlFor="city">City</label>
                <input onChange={handleChange} defaultValue={p.city} type="text" id="city" pattern="[א-תa-zA-Z\s]{2,25}" required />
                <label htmlFor="street">Street</label>
                <input onChange={handleChange} defaultValue={p.street} type="text" id="street" pattern="[א-תa-zA-Z\s]{2,25}" required />
                <label htmlFor="houseNamber">House Number</label>
                <input onChange={handleChange} defaultValue={p.houseNumber} type="text" id="houseNamber" pattern="[0-9]{1,4}" />
                <h2>Covid-19</h2>
                <div className="vacDiv">
                    <h4>Vaccination 1:</h4>
                    <label htmlFor="dateVac1">Date:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac1 && p.vaccines.vac1.date} type="date" id="dateVac1" />
                    <label htmlFor="manufacturer1">Manufacturer:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac1 && p.vaccines.vac1.manufacturer} type="text" id="manufacturer1" />
                </div><br></br>
                <div className="vacDiv">
                    <h4>Vaccination 2:</h4>
                    <label htmlFor="dateVac2">Date:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac2 && p.vaccines.vac2.date} type="date" id="dateVac2" />
                    <label htmlFor="manufacturer2">Manufacturer:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac2 && p.vaccines.vac2.manufacturer} type="text" id="manufacturer2" />
                </div><br></br>
                <div className="vacDiv">
                    <h4>Vaccination 3:</h4>
                    <label htmlFor="dateVac3">Date:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac3 && p.vaccines.vac3.date} type="date" id="dateVac3" />
                    <label htmlFor="manufacturer3">Manufacturer:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac3 && p.vaccines.vac3.manufacturer} type="text" id="manufacturer3" />
                </div><br></br>
                <div className="vacDiv">
                    <h4>Vaccination 4:</h4>
                    <label htmlFor="dateVac4">Date:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac4 && p.vaccines.vac4.date} type="date" id="dateVac4" />
                    <label htmlFor="manufacturer4">Manufacturer:</label>
                    <input onChange={handleChange} defaultValue={p.vaccines.vac4 && p.vaccines.vac4.manufacturer} type="text" id="manufacturer4" />
                </div><br></br>
                <br></br>
                <label htmlFor="positiveResultDate">Date of receiving a positive result:</label>
                <input onChange={handleChange} defaultValue={p.positiveResultDate} type="date" id="positiveResultDate" />
                <label htmlFor="recoveryDate">Date of recovery:</label>
                <input onChange={handleChange} defaultValue={p.recoveryDate} type="date" id="recoveryDate" />
                <button type='submit' style={{ marginTop: "1vw", width: '100%', marginLeft: '0' }}>Update</button>
            </div>
        </form>
    )
}



