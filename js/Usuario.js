class Usuario {

  
  
  constructor(){
    this.linkToLogin =  document.getElementById('linkToLogin')
    this.linkToRegister = document.getElementById('linkToRegister')
    this.formLogin = document.getElementById('formLogin')
    this.formRegister = document.getElementById('formRegister')
    this.formRegister.style.display = 'none'
    this.token;
    this.alternarDivs()
    this.registarUsuario()
    this.loguearUsuario()
  }


  alternarDivs(){
    this.linkToLogin.addEventListener('click', ()=>{
      this.formRegister.style.display = 'none'
      this.formLogin.style.display = 'flex'
    })

    this.linkToRegister.addEventListener('click', ()=>{
      this.formRegister.style.display = 'flex'
      this.formLogin.style.display = 'none'
    })
    

  }


  #validarDatos(arr){

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


    arr.forEach((el)=>{
      validarInput(el, `Por favor ingrese un dato valido.`)
    })


    return errores

  }


  registarUsuario(){
    const button = this.formRegister.querySelector('button')

    const nombre = this.formRegister.querySelector('#nombre')
    const apellido = this.formRegister.querySelector('#apellido')
    const usuario = this.formRegister.querySelector('#usuario')
    const fecha = this.formRegister.querySelector('#fecha_nacimiento')
    const contrasena = this.formRegister.querySelector('#contrasena')


    button.addEventListener('click', async ()=>{
      const arr = [nombre, apellido, usuario, fecha, contrasena]
      const validacionDatos = this.#validarDatos(arr)
      
      if(validacionDatos === undefined){
        
        const data = {
          usuario: usuario.value,
          contrasena: contrasena.value,
          nombre: nombre.value,
          apellido: apellido.value,
          fecha_nacimiento: new Date(fecha.value)
        }

        try {
          await fetch('http://127.0.0.1:3000/registrar_usuario', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            }
          })


          const dataLogin = {
            usuario: usuario.value,
            contrasena: contrasena.value
          }

          const login = await fetch('http://127.0.0.1:3000/login', {
            method: "POST",
            body: JSON.stringify(dataLogin),
            headers: {
              "Content-Type": "application/json",
            }
          })

          const response = await login.json()

          this.token = response.token

          localStorage.setItem('token', this.token)

          window.location.assign('../pacientes.html')

        } catch (error) {
          console.log(error)
        }

      }
    })
  }

  
  loguearUsuario(){
    const button = this.formLogin.querySelector('button')

    const usuario = this.formLogin.querySelector('#nombre_usuario')
    const contrasena = this.formLogin.querySelector('#contrasena_usuario')


    button.addEventListener('click', async ()=>{
      const arr = [usuario, contrasena]

      const validacionDatos = this.#validarDatos(arr)

      if(validacionDatos === undefined){
        const data = {
          usuario: usuario.value,
          contrasena: contrasena.value,
        }

        try {
          const login = await fetch('http://127.0.0.1:3000/login', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            }
          })


          const response = await login.json()

          
          if(typeof response.mensaje === 'string' && response.mensaje.includes('Nombre')){
            document.getElementById(`nombre_usuario-p`).textContent = response.mensaje;
          }else if(typeof response.mensaje === 'string' && response.mensaje.includes('Contraseña')){
            document.getElementById(`contrasena_usuario-p`).textContent = response.mensaje;
          }else {
            this.token = response.token
            localStorage.setItem('token', this.token)
            window.location.assign('../pacientes.html')
          }

        } catch (error) {
          console.log(error)
        }

      }


    })
  }


}

const miUsuario = new Usuario()