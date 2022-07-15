const menuToggle = document.getElementsByClassName("menu-toggle");
const navMenu = document.getElementsByClassName("nav-menu")[0];


for(let i = 0 ;  i < menuToggle.length ; i++){
    menuToggle[i].addEventListener("click" , () =>{
        navMenu.classList.toggle("active");
    })
}

