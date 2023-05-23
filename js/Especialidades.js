import Card from "./Card.js";

class Especialidad {


  constructor(){
    this.token = localStorage.getItem('token')
    this.#crearFormulario()
  }


  async listarEspecialidades(){


    // contenedor donde va a agregar los doctores
    const section = document.querySelector('#section__especialidades');
    

    try {

      // trae el listado de doctores
      const especialidades = await fetch('http://127.0.0.1:3000/especialidades', {
        headers: {
          "Authorization": `Bearer ${this.token}`
        }
      })

      if(especialidades.status === 401) {
        window.location.assign('../index.html')
      }
      
      const data = await especialidades.json()
  
      
      // valida si no hay doctores
      if (data.length === 0){

        // crea nodos para mostrar mensaje de que no hay doctores
        const noData = document.createElement('div');
        noData.className = 'data__container'

        const mensaje = document.createElement('p');
        mensaje.className = 'data__text'
        mensaje.textContent = "No hay especialidades registradas en la base de datos en este momento"

        section.appendChild(noData)
        noData.appendChild(mensaje)

      }else{
        
        const tabla = document.createElement('table')
        const thead = document.createElement('thead')
        const tr = document.createElement('tr')
        
        const thID = document.createElement('th')
        thID.textContent = 'ID'

        const thNombre = document.createElement('th')
        thNombre.textContent = 'Nombre'


        tr.appendChild(thID)
        tr.appendChild(thNombre)
        thead.appendChild(tr)
        tabla.appendChild(thead)
        section.appendChild(tabla)


        const tbody = document.createElement('tbody')
        tabla.appendChild(tbody)

        data.forEach((especialidad, index) => {

          const tr = document.createElement('tr')
          
          const tdID = document.createElement('td')
          tdID.textContent = index + 1
          
          const tdNombre = document.createElement('td')
          tdNombre.textContent = especialidad.nombre


          tr.appendChild(tdID)
          tr.appendChild(tdNombre)
          tbody.appendChild(tr)

        })


      };
      
    } catch (error) {
      console.log(error.message);
    }

  }


  #validarDatos(nombre){

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
    validarInput(nombre, 'Por favor ingrese un nombre de especialidad valido.')

    return errores

  }


  async crearEspecialidad(){
    
    // nodos del dom
    let nombreInput = document.getElementById('nombre')


    // valida los datos
    const datosValidados = this.#validarDatos(nombreInput)
    

    // envia la peticion al back
    if(datosValidados !== true) {


      const data = {
        nombre: nombreInput.value,
      }

      try{
        await fetch('http://127.0.0.1:3000/crear_especialidad', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
          }
        })

        nombreInput.value = ''



      }catch(error){
        console.error(error.message);
      }

    }

  }


  async #crearFormulario(){

    // contenedor
    const contenedor = document.getElementById('form')

    // peticion
    const formDoctor = await fetch('http://127.0.0.1:3000/formulario/Especialidad', {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    })
    const data = await formDoctor.json()


    // crear inputs y labels
    Object.entries(data.properties).forEach(([key, value]) =>{

      if(key !== 'idEspecialidad' && key !== 'Doctor'){


        const label = document.createElement('label')
        label.setAttribute('for', key)
        label.className = 'label'
        
        key == 'nombre' ? label.textContent = 'Nombre de la Especialidad' : ''

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
    

    // crea el boton
    const boton = document.createElement('button')
    boton.type = 'button'
    boton.textContent = 'Registrar'
    contenedor.appendChild(boton)


    // crea el doctor
    boton.addEventListener('click', (event)=>{

      this.crearEspecialidad()
    })

  }

}


const especialidad = new Especialidad()

especialidad.listarEspecialidades()