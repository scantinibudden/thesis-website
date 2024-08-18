import laboratoryLogo from '../assets/liaa-logo.png';
import csDepartmentLogo from '../assets/logo-dc.png';

function LogosHeader() {
    return (
        <div>
            <div className='header-container'>
                <img className='header-image' src={laboratoryLogo} alt="Logo del Laboratorio de Inteligencia Artifical Aplicada UBA" ></img>
                <img className='header-image' src={csDepartmentLogo} alt="Logo del Departamento de Computación UBA" ></img>
            </div>
        </div>
    )
};

export default LogosHeader;