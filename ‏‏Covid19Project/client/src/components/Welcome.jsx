
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate=useNavigate();
    function enterRepository(){
        navigate(`/patients`);
    }
    return (
        <div>
            <h1 style={{fontSize:"5rem"}}>WELCOME!!</h1>
            <button onClick={enterRepository}>Enter To Repository</button>
        </div>
       
    )
}