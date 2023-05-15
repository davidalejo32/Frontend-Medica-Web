import Card from "./Card.js";

class Paciente {


  constructor(){
    this.#crearFormulario()
  }

  #calcularEdad(fechaNacimiento){
    let fechaNac = new Date(fechaNacimiento);
    let fechaActual = new Date();
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
    let diferenciaMeses = fechaActual.getMonth() - fechaNac.getMonth();
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && fechaActual.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return `${edad} Años`;
  }


  async listarPacientes(){

    const container = document.getElementById('cardsContainer');
    const sectionCard = document.querySelector('.section__cards');

    try {
      const pacientes = await fetch('http://127.0.0.1:3000/pacientes')
      const data = await pacientes.json()
  
      // const data = []
  
      if (data.length === 0){

        const noData = document.createElement('div');
        noData.className = 'data__container'
        const mensaje = document.createElement('p');
        mensaje.className = 'data__text'
        mensaje.textContent = "No hay pacientes registrados en la base de datos en este momento"

        sectionCard.appendChild(noData)
        noData.appendChild(mensaje)

      }else{
  
        data.forEach(el => {
          
          const {cedula, nombre, apellido, fecha_nacimiento, telefono} = el
    
          const nombreCompleto = `${nombre} ${apellido}`;
          const edad = this.#calcularEdad(fecha_nacimiento)
          
          const card = new Card(nombreCompleto, edad, telefono, 'Numero de contacto', cedula, 'Numero de cedula', 'Paciente', container)
          card.crearCard()
        });
      }
    } catch (error) {
      console.log(error.message);
    }

  }



  #validarDatos(cedula, nombre, apellido, fechaNacimiento, telefono){

    let errores;


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

    validarInput(cedula, 'Por favor ingrese una cedula valida.')
    validarInput(nombre, 'Por favor ingrese un nombre valido.')
    validarInput(apellido, 'Por favor ingrese un apellido valido.')
    validarInput(fechaNacimiento, 'Por favor ingrese una fecha de nacimiento valida.')
    validarInput(telefono, 'Por favor ingrese un numero de telefono valido.')

    return errores

  }


  async crearPaciente(){
    
    let cedulaInput = document.getElementById('cedula')
    let nombreInput = document.getElementById('nombre')
    let apellidoInput = document.getElementById('apellido')
    let fechaNacimientoInput = document.getElementById('fecha_nacimiento')
    let telefonoInput = document.getElementById('telefono')


    const datosValidados = this.#validarDatos(cedulaInput, nombreInput, apellidoInput, fechaNacimientoInput, telefonoInput)
    

    if(datosValidados !== true) {


      const data = {
        cedula: parseInt(cedulaInput.value),
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        fecha_nacimiento: fechaNacimientoInput.value,
        telefono: telefonoInput.value
      }

      try{
        await fetch('http://127.0.0.1:3000/crear_paciente', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          }
        })

        cedulaInput.value = ''
        nombreInput.value = ''
        apellidoInput.value = ''
        fechaNacimientoInput.value = ''
        telefonoInput.value = ''



      }catch(error){
        console.error(error.message);
      }

    }

  }


  async #crearFormulario(){

    const contenedor = document.getElementById('form')

    const formPacientes = await fetch('http://127.0.0.1:3000/formulario/Paciente')
    const data = await formPacientes.json()


    Object.entries(data.properties).forEach(([key, value]) =>{

      if(key !== 'Cita'){


        const label = document.createElement('label')
        label.setAttribute('for', key)
        label.className = 'label'
        
        key == 'nombre' ? label.textContent = 'Nombres' : ''
        key == 'apellido' ? label.textContent = 'Apellidos' : ''
        key == 'fecha_nacimiento' ? label.textContent = 'Fecha de Nacimiento' : ''
        key == 'cedula' ? label.textContent = 'Numero de Cedula' : ''
        key == 'telefono' ? label.textContent = 'Numero de Contacto' : ''

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
    

    const boton = document.createElement('button')
    boton.type = 'button'
    boton.textContent = 'Registrar'
    contenedor.appendChild(boton)





    boton.addEventListener('click', (event)=>{

      this.crearPaciente()
    })

  }

}

const paciente = new Paciente()
paciente.listarPacientes()


