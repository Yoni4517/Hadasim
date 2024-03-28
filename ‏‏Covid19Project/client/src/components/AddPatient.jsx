import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPatient(props) {
    const [fetchError, setFetchError] = useState(null);
    const navigate = useNavigate();

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
            positiveResultDate: positiveResultDate.value == '' ? null : positiveResultDate.value,
            recoveryDate: recoveryDate.value == '' ? null : recoveryDate.value,
            vaccines: {
                vac1: {
                    date: dateVac1.value,
                    manufacturer: manufacturer1.value
                },
                vac2: {
                    date: dateVac2.value,
                    manufacturer: manufacturer2.value
                },
                vac3: {
                    date: dateVac3.value,
                    manufacturer: manufacturer3.value
                },
                vac4: {
                    date: dateVac4.value,
                    manufacturer: manufacturer4.value
                },
            }
        }
        try {
            console.log(JSON.stringify(patientDetails));
            const response = await fetch(`http://localhost:2025/patients`,
                {
                    method: 'POST',
                    body: JSON.stringify(patientDetails),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
            if (!response.ok) throw "Adding the new todo was failed";
            const user = await response.json();
            localStorage.setItem("currentUser", JSON.stringify(user));
            navigate(`/patients`);
            setFetchError(null);
        }
        catch (err) {
            setFetchError(err.message);
        }
    }

    return (
        <>
            <button className="upperLeftButton" onClick={() => { navigate('/patients') }}> ⬅ Back </button>
            <form onSubmit={onSubmit} style={{ textAlign: 'start' }} >
                <div className="formDiv" >
                    <h2 style={{ color: " #023047" }}>Enter Patient Details:</h2>
                    <label htmlFor="id">Id</label>
                    <input onChange={handleChange} type="text" id="id" pattern="[0-9]{7,9}" required />
                    <label htmlFor="firstName">First Name</label>
                    <input onChange={handleChange} type="text" id="firstName" pattern="[א-תa-zA-Z\s]{2,25}" required />
                    <label htmlFor="lastName">Last Name</label>
                    <input onChange={handleChange} type="text" id="lastName" pattern="[א-תa-zA-Z\s]{2,25}" required />
                    <label htmlFor="birthDate">Birth Date</label>
                    <input onChange={handleChange} type="date" id="birthDate" required />
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input onChange={handleChange} type="tel" id="phoneNumber" required />
                    <label htmlFor="cellphoneNumber">Cellphone Number</label>
                    <input onChange={handleChange} type="tel" id="cellphoneNumber" required />
                    <p>Address:</p>
                    <label htmlFor="city">City</label>
                    <input onChange={handleChange} type="text" id="city" pattern="[א-תa-zA-Z\s]{2,25}" required />
                    <label htmlFor="street">Street</label>
                    <input onChange={handleChange} type="text" id="street" pattern="[א-תa-zA-Z\s]{2,25}" required />
                    <label htmlFor="houseNamber">House Number</label>
                    <input onChange={handleChange} type="text" id="houseNamber" required />
                    <h2>Covid-19</h2>
                    <div className="vacDiv">
                        <h4>Vaccination 1:</h4>
                        <label htmlFor="dateVac1">Date:</label>
                        <input onChange={handleChange} type="date" id="dateVac1" />
                        <label htmlFor="manufacturer1">Manufacturer:</label>
                        <input onChange={handleChange} type="text" id="manufacturer1" pattern="[א-תa-zA-Z\s]{2,25}" />
                    </div><br></br>
                    <div className="vacDiv">
                        <h4>Vaccination 2:</h4>
                        <label htmlFor="dateVac2">Date:</label>
                        <input onChange={handleChange} type="date" id="dateVac2" />
                        <label htmlFor="manufacturer2">Manufacturer:</label>
                        <input onChange={handleChange} type="text" id="manufacturer2" pattern="[א-תa-zA-Z\s]{2,25}" />
                    </div><br></br>
                    <div className="vacDiv">
                        <h4>Vaccination 3:</h4>
                        <label htmlFor="dateVac3">Date:</label>
                        <input onChange={handleChange} type="date" id="dateVac3" />
                        <label htmlFor="manufacturer3">Manufacturer:</label>
                        <input onChange={handleChange} type="text" id="manufacturer3" pattern="[א-תa-zA-Z\s]{2,25}" />
                    </div><br></br>
                    <div className="vacDiv">
                        <h4>Vaccination 4:</h4>
                        <label htmlFor="dateVac4">Date:</label>
                        <input onChange={handleChange} type="date" id="dateVac4" />
                        <label htmlFor="manufacturer4">Manufacturer:</label>
                        <input onChange={handleChange} type="text" id="manufacturer4" pattern="[א-תa-zA-Z\s]{2,25}" />
                    </div><br></br>
                    <br></br>
                    <label htmlFor="positiveResultDate">Date of receiving a positive result:</label>
                    <input onChange={handleChange} type="date" id="positiveResultDate" />
                    <label htmlFor="recoveryDate">Date of recovery:</label>
                    <input onChange={handleChange} type="date" id="recoveryDate" />
                    <button type='submit' style={{ marginTop: "1vw", width: '100%', marginLeft: '0' }}>Add</button>
                </div>
            </form>
        </>
    )
}



