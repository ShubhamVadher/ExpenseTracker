const x=document.querySelector('.logout-btn');
x.addEventListener('click',(e)=>{
    
    const y=confirm('Are you sure you want to logout')
    if(!y){
        e.preventDefault();
    }
})