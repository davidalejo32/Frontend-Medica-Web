import Card from "./Card.js";

class Doctor {


  constructor(){
    this.#crearFormulario()
  }


  async listarDoctores(){


    // contenedor donde va a agregar los doctores
    const container = document.getElementById('cardsContainer');
    const sectionCard = document.querySelector('.section__cards');


    try {

      // trae el listado de doctores
      const doctores = await fetch('http://127.0.0.1:3000/doctores')
      const data = await doctores.json()
  
      
      // valida si no hay doctores
      if (data.length === 0){

        // crea nodos para mostrar mensaje de que no hay doctores
        const noData = document.createElement('div');
        noData.className = 'data__container'

        const mensaje = document.createElement('p');
        mensaje.className = 'data__text'
        mensaje.textContent = "No hay doctores registrados en la base de datos en este momento"

        sectionCard.appendChild(noData)
        noData.appendChild(mensaje)

      }else{
        
        // si hay doctores, crea las cards
        data.forEach(async (el) => {

          const {nombre, apellido, consultorio, correo, idEspecialidad } = el
          const request = await fetch(`http://127.0.0.1:3000/especialidades/${idEspecialidad}`)
          const especialidad = await request.json()
    
          const nombreCompleto = `${nombre} ${apellido}`;
          
          const card = new Card(nombreCompleto, `Consultorio ${consultorio}`, correo, 'Correo Electronico', especialidad.nombre, 'Especialidad', 'Doctor', container)
          card.crearCard()
        });
      }
    } catch (error) {
      console.log(error.message);
    }

  }


  #validarDatos(nombre, apellido, consultorio, correo){

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
    validarInput(nombre, 'Por favor ingrese un nombre valido.')
    validarInput(apellido, 'Por favor ingrese un apellido valido.')
    validarInput(consultorio, 'Por favor ingrese un consultorio valido.')
    validarInput(correo, 'Por favor ingrese un correo valido.')

    return errores

  }


  async crearDoctor(){
    
    // nodos del dom
    let nombreInput = document.getElementById('nombre')
    let apellidoInput = document.getElementById('apellido')
    let consultorioInput = document.getElementById('consultorio')
    let correoInput = document.getElementById('correo')
    let idEspecialidadInput = document.getElementById('Especialidades')

    // data set del option
    let opcionSeleccionada = idEspecialidadInput.options[idEspecialidadInput.selectedIndex];
    let opcionSeleccionadaID = opcionSeleccionada.dataset.id;

    // valida los datos
    const datosValidados = this.#validarDatos(nombreInput, apellidoInput, consultorioInput, correoInput, opcionSeleccionadaID )
    

    // envia la peticion al back
    if(datosValidados !== true) {


      const data = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        consultorio: parseInt(consultorioInput.value),
        correo: correoInput.value,
        idEspecialidad: parseInt(opcionSeleccionadaID)
      }

      try{
        await fetch('http://127.0.0.1:3000/crear_doctor', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          }
        })

        nombreInput.value = ''
        apellidoInput.value = ''
        consultorioInput.value = ''
        correoInput.value = ''
        idEspecialidadInput.value = ''



      }catch(error){
        console.error(error.message);
      }

    }

  }


  async #crearFormulario(){

    // contenedor
    const contenedor = document.getElementById('form')

    // peticion
    const formDoctor = await fetch('http://127.0.0.1:3000/formulario/Doctor')
    const data = await formDoctor.json()


    // crear inputs y labels
    Object.entries(data.properties).forEach(([key, value]) =>{

      if(key !== 'Cita' && key !== 'Especialidad' && key !== 'idDoctor'){


        const label = document.createElement('label')
        label.setAttribute('for', key)
        label.className = 'label'
        
        key == 'nombre' ? label.textContent = 'Nombres' : ''
        key == 'apellido' ? label.textContent = 'Apellidos' : ''
        key == 'consultorio' ? label.textContent = 'Consultorio' : ''
        key == 'correo' ? label.textContent = 'Correo' : ''
        key == 'Especialidad' ? label.textContent = 'Especialidad' : ''

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
    

    // crea select con su labvel

    const label = document.createElement('label')
    label.textContent = 'Especialidad'
    label.className = 'label'
    label.setAttribute('for', 'Especialidades')
    contenedor.appendChild(label)

    const select = document.createElement('select')
    select.name = 'especialidades'
    select.id = 'Especialidades'
    select.className = 'select'


    
    // listar especialidades
    const especialidades = await fetch('http://127.0.0.1:3000/especialidades')
    const especialidadesData = await especialidades.json()


    // crea los options
    especialidadesData.forEach(el => {
      
      const {nombre} = el


      const option = document.createElement('option')
      option.value = nombre
      option.textContent = nombre
      option.setAttribute('data-id', el.idEspecialidad)
      
      select.appendChild(option)
    })

    contenedor.appendChild(select)


  // crea la etiqueta para el error
    const p = document.createElement('p')
    p.id = 'Especialidades-p'
    p.style.color = 'red'
    contenedor.appendChild(p)


    // crea el boton
    const boton = document.createElement('button')
    boton.type = 'button'
    boton.textContent = 'Registrar'
    contenedor.appendChild(boton)


    // valida y agregar el mensaje de error
    if(especialidadesData.length == 0){
      boton.disabled = true
      p.textContent = 'Debes tener una especialidad registrada'
    }


    // crea el doctor
    boton.addEventListener('click', (event)=>{

      this.crearDoctor()
    })

  }

}


const doctor = new Doctor()

doctor.listarDoctores()