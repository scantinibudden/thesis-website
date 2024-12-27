import '../pages/home.css';

function UserFormExplanation() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
      <p className='experiment-explanation'>
      Para realizar este experimento te vamos a pedir que completes un breve cuestionario. Esto es de gran importancia para el análisis de los resultados que obtengamos. Este cuestionario te llevará menos de un minuto y te lo preguntaremos por única vez.
      </p>
    </div>
  );
};

export default UserFormExplanation;