import { Routes, Route } from "react-router-dom";
import './App.css'
import Patients from './components/Patients';
import AddPatient from './components/AddPatient'
import Welcome from './components/Welcome';
import SinglePatientDetails from './components/SinglePatientDetails';

export default function App() {
  return (
    <Routes>
      <Route index element={<Welcome />}/>
      <Route path="patients"  >
        <Route index element={<Patients />} />
        <Route path=":id">
          <Route index element={<SinglePatientDetails />}/>
        </Route>
        <Route path="add" element={<AddPatient />} />
      </Route>
    </Routes>
  )
}
