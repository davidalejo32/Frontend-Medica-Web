import Card from "./Card.js";

class Cita {


  constructor(){
    this.token = localStorage.getItem('token')
    this.#crearFormulario()
  }


  async listarCitas(){


    // contenedor donde va a agregar los doctores
    const container = document.getElementById('cardsContainer');
    const sectionCard = document.querySelector('.section__cards');


    try {

      // trae el listado de doctores
      const citas = await fetch('http://127.0.0.1:3000/citas', {
        headers: {
          "Authorization": `Bearer ${this.token}`
        }
      })

      if(citas.status === 401) {
        window.location.assign('../index.html')
      }

      const data = await citas.json()
      
      
      
      // valida si no hay doctores
      if (data.length === 0){

        // crea nodos para mostrar mensaje de que no hay doctores
        const noData = document.createElement('div');
        noData.className = 'data__container'

        const mensaje = document.createElement('p');
        mensaje.className = 'data__text'
        mensaje.textContent = "No hay citas registradas en la base de datos en este momento"

        sectionCard.appendChild(noData)
        noData.appendChild(mensaje)

      }else{
        
        // si hay doctores, crea las cards
        data.forEach(async (el) => {

          const {pacienteCedula, idDoctor } = el

          const paciente = await fetch(`http://127.0.0.1:3000/paciente/${pacienteCedula}`, {
            headers: {
              "Authorization": `Bearer ${this.token}`
            }
          })
          const dataPaciente = await paciente.json()

          const  nombrePaciente = dataPaciente.nombre
          const  apellidoPaciente = dataPaciente.apellido

          const nombreCompletoPaciente = `${nombrePaciente} ${apellidoPaciente}`;


          const doctor = await fetch(`http://127.0.0.1:3000/doctor/${idDoctor}`, {
            headers: {
              "Authorization": `Bearer ${this.token}`
            }
          })
          const doctorData = await doctor.json()
            

          const { nombre, apellido, consultorio, idEspecialidad } = doctorData
          const nombreCompletoDoctor = `${nombre} ${apellido}`;
          

          const especialidad = await fetch(`http://127.0.0.1:3000/especialidades/${idEspecialidad}`, {
            headers: {
              "Authorization": `Bearer ${this.token}`
            }
          })
          const dataEspecialidad = await especialidad.json()

          const nombreEspecialidad  = dataEspecialidad.nombre



          const card = new Card(nombreCompletoPaciente, `Consultorio ${consultorio}`, nombreCompletoDoctor, 'Doctor', nombreEspecialidad, 'Especialidad', 'Cita', container)
          card.crearCard()
        });
      }
    } catch (error) {
      console.log(error.message);
    }

  }


  #validarDatos(pacienteCedulaInput){

    let errores;

    // valida los inputs

    function validarInput(input, mensaje) {

      if(input.value == ''){
        input.classList.add('error-input');
        document.getElementById(`${input.id}-p`).textContent = mensaje;
        errores = true

      }

      input.addEventListener('input', () => {
        if (input.value == '') {
          input.classList.add('error-input')
          document.getElementById(`${input.id}-p`).textContent = mensaje
        }else {
          
          input.classList.remove('error-input')
          document.getElementById(`${input.id}-p`).textContent = ''
        }
      })


    }

    // valida los datos
    validarInput(pacienteCedulaInput, 'Por favor ingrese un numero de cedula valido.')

    return errores

  }


  async crearCita(){
    
    // nodos del dom
    let pacienteCedulaInput = document.getElementById('Paciente')
    let doctorID = document.getElementById('doctores')

    // data set del option
    let opcionSeleccionada = doctorID.options[doctorID.selectedIndex];
    let opcionSeleccionadaID = opcionSeleccionada.dataset.id;

    
    // valida los datos
    const datosValidados = this.#validarDatos(pacienteCedulaInput)
    

    // envia la peticion al back
    if(datosValidados !== true) {


      const data = {
        pacienteCedula: parseInt(pacienteCedulaInput.value),
        idDoctor: parseInt(opcionSeleccionadaID),
      }

      try{
        const request = await fetch('http://127.0.0.1:3000/crear_cita', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
          }
        })

        const response = await request.json()
        const pacienteP = document.getElementById('Paciente-p');


        if(response.error){
          pacienteP.textContent = 'El paciente no esta registrado'
        }else {
          pacienteCedulaInput.value = '';
          pacienteP
        }



      }catch(error){
        console.error('Error de Red',error.message);
      }

    }

  }


  async #crearFormulario(){

    // contenedor
    const contenedor = document.getElementById('form')

    // peticion
    const formCita = await fetch('http://127.0.0.1:3000/formulario/Cita', {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    })
    const data = await formCita.json()


    // crear inputs y labels
    Object.entries(data.properties).forEach(([key, value]) =>{

      if(key !== 'idCita' && key !== 'Doctor'){


        const label = document.createElement('label')
        label.setAttribute('for', key)
        label.className = 'label'
        
        key == 'Paciente' ? label.textContent = 'Numero de documento del paciente' : ''

        const input = document.createElement('input')
        input.setAttribute('type', value.type)
        input.setAttribute('id', key)
        input.setAttribute('name', key)
        input.setAttribute('required', true)
        input.className = 'input'

        const p = document.createElement('p')
        p.className = 'error'
        p.id = `${key}-p`

        contenedor.appendChild(label)
        contenedor.appendChild(input)
        contenedor.appendChild(p)
      }

    })
    

    // crea el label de especialidad

    const label = document.createElement('label')
    label.textContent = 'Especialidad'
    label.className = 'label'
    label.setAttribute('for', 'Especialidades')
    contenedor.appendChild(label)


    // crea el select de especialidad
    const select = document.createElement('select')
    select.name = 'especialidades'
    select.id = 'especialidades'
    select.className = 'select'
    

    // peticion de las especialidades
    const especialidades = await fetch('http://127.0.0.1:3000/especialidades', {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    })
    const especialidadesData = await especialidades.json()


    // crea los options de las especialidades
    especialidadesData.forEach(el => {
      
      const {nombre} = el


      const option = document.createElement('option')
      option.value = nombre
      option.textContent = nombre
      option.setAttribute('data-id', el.idEspecialidad)
      
      select.appendChild(option)
    })

    contenedor.appendChild(select)


  // crea la etiqueta para el error de especialidad
    const errorEspecialidad = document.createElement('p')
    errorEspecialidad.id = 'Especialidades-p'
    errorEspecialidad.style.color = 'red'
    contenedor.appendChild(errorEspecialidad)


    //  label de doctor
    
    const labelDoctor = document.createElement('label')
    labelDoctor.className = 'label'
    labelDoctor.setAttribute('for', 'doctor')
    labelDoctor.textContent = 'Doctor'
    contenedor.appendChild(labelDoctor)
    
    // crea el select para los doctores segun la especialidad
    const selectDoctor = document.createElement('select')
    selectDoctor.name = 'doctores'
    selectDoctor.id = 'doctores'
    selectDoctor.className = 'select'


    // carga y genera los doctores segun la especialidad seleccionada

    async function cargarDoctoresId (contenedorDoctores) {

      // limpia el contenedor de dcotores
      while (contenedorDoctores.firstChild){
        contenedorDoctores.removeChild(contenedorDoctores.firstChild)
      }


      try{
        // trae el data set de la opcion seleccionada
        let opcionSeleccionada = select.options[select.selectedIndex];
        let opcionSeleccionadaID = opcionSeleccionada.dataset.id;
        

        // ejecuta la consulta con el data set (id)
        const doctores = await fetch(`http://127.0.0.1:3000/doctores/${opcionSeleccionadaID || 1}`, {
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        })
  
        const data = await doctores.json()
  


        
        // valida si no hay doctores y muestra el mensaje de rror
        if(data.length === 0 ){
          boton.disabled = true
          

          errorDoctor.textContent =  'Debes tener al menos un doctor registrado con esa especialidad'
          contenedorDoctores.insertAdjacentElement('afterend', errorDoctor )
        }else {
          boton.disabled = false
          errorDoctor.textContent =  ''
        }
  
        // rellena el contenedor de doctores con la informacion
        data.forEach(el => {
  
          const {idDoctor, nombre, apellido} = el
          
          const option = document.createElement('option')
          option.textContent = `${nombre} ${apellido}`
          option.setAttribute('data-id', idDoctor)
        
          contenedorDoctores.appendChild(option)
  
        })
      }catch(error) {
        console.log(error.mensaje);
      }

    }

    // ejecuta la funcion sinedo la primera vez que se carga
    cargarDoctoresId(selectDoctor)
    contenedor.appendChild(selectDoctor)

    // si cambio de especialidad carga los nuevos doctores
    select.addEventListener('change', ()=>{
      cargarDoctoresId(selectDoctor)
    })



    //parrafo de error por si no hay doctores creados

    let errorDoctor = document.createElement('p')
    errorDoctor.id = 'Doctor-p'
    errorDoctor.style.color = 'red'


    // crea el boton
    const boton = document.createElement('button')
    boton.type = 'button'
    boton.textContent = 'Registrar'
    contenedor.appendChild(boton)


    // valida y agregar el mensaje de error
    if(especialidadesData.length == 0){
      boton.disabled = true
      errorEspecialidad.textContent = 'Debes tener una especialidad registrada'
    }


    // crea el doctor
    boton.addEventListener('click', (event)=>{

      this.crearCita()
    })

  }

}


const cita = new Cita()
cita.listarCitas()
