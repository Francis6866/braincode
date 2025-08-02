//   import { supabase } from "./supabaseConfig.js";
  const registerNameEl = document.querySelector('#registerName')
  const registerEmailEl = document.querySelector('#registerEmail')
  const registerPasswordEl = document.querySelector('#registerPassword')
  const registerFormEl = document.querySelector('#registerForm')

  const loginEmailEl = document.querySelector('#loginEmail')
  const loginPasswordEl = document.querySelector('#loginPassword')
  const loginFormEL = document.querySelector('#loginForm')

  const loginModalOp = document.querySelector('#loginModalOp')
  const registerModalOp = document.querySelector('#registerModalOp')
  const loginModalClose = document.querySelector('#loginModalClose')
  const registerModalClose = document.querySelector('#registerModalClose')


//   initialise supabase
const supabaseUrl = 'https://vjcmduatoxxehehjhocp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqY21kdWF0b3h4ZWhlaGpob2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDQ3NzgsImV4cCI6MjA2MjcyMDc3OH0.3_C6bBUZp8CUCRNLiKxIh6EG5mnWdUNV0GDEv9K45DE';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 


// logic to open/close modal
  function openModal(id) {
    document.getElementById(id).style.display = 'block';
  }

  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  // Close modals when clicking outside the modal content
  window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }

loginModalOp.addEventListener('click', ()=>{
    openModal('loginModal')
})
registerModalOp.addEventListener('click', ()=>{
    openModal('registerModal')
})
loginModalClose.addEventListener('click', ()=>{
    closeModal('loginModal')
})
registerModalClose.addEventListener('click', ()=>{
    closeModal('registerModal')
})




// register user logic
registerFormEl.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const fName = registerNameEl.value
    const email = registerEmailEl.value
    const password = registerPasswordEl.value

    if(!fName || !email || !password) return alert('All fields are required')

    if(email.length <= 5){
        return alert('email should be more than 5 letters')
    }else if(fName.split(' ').length < 2) {
        return alert('Name should be more than 1')
    }else if(password.length <= 5) {
        return alert('password should be more than 5 letters')
    }

    const {data, error} = await supabase.from('braincode').insert({
        full_name: fName,
        email: email,
        password: password
    }).select()

    if(error) return alert('Error registering user, please refresh')

     registerNameEl.value = ''
     registerEmailEl.value = ''
     registerPasswordEl.value = ''
     document.getElementById('success').textContent = 'User successfully registered, Login to continue'

    setTimeout(()=>{ closeModal('registerModal') }, 3000)
})


// login logic
loginFormEL.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = loginEmailEl.value;
    const password = loginPasswordEl.value;

    if(!email || !password) return alert('All fields are required');

    if(email.length <= 5){
        return alert('email should be more than 5 letters')
    }else if(password.length <= 5) {
        return alert('password should be more than 5 letters')
    }

    const {data, error} = await supabase.from('braincode').select().eq('email', email)
    if(error) return alert('Error fetching user, please refresh')

    if(data.length < 1) return alert('User does not exist')

    if(data[0].password !== password) return alert('Invalid password')

    loginEmailEl.value = ''
    loginPasswordEl.value = ''
    document.getElementById('loginSuccess').textContent = `Welcome back (${data[0].full_name.split(' ')[0]})`

    setTimeout(() => {
        // Close the modal (optional if you're redirecting immediately)
        closeModal('registerModal');
      
        // Redirect to quiz.html
        window.location.href = 'quiz.html';
      }, 3000);
})