const navBar_contatiner = document.querySelector('.navBar_contatiner');


axios({
    method: 'get',
    url: '/isauth',
    responseType: 'stream'
})
.then((res)=>{
    return res.data;
})
.then(function (response) {
    if(response.success){
        if(response.logged){
            const navBarE = `
            <nav class="navbar">
            <a href="/" style="position: absolute; left:10px; font-size:20px"> 
              <i class="fas fa-apple-alt"></i>
            </a>
            <a href="/auth/logout">
              <i class="fas fa-key">
                <p>LOGOUT</p>
              </i>
            </a>
            <a href="/grade/rest">
              <p>
                <i class="fas fa-school"></i>
                잔여학점
              </p>
            </a>
            <a href="/grade/average">
              <p>
                <i class="fas fa-book"></i>
                평균학점
              </p>
            </a>
            <a href="/assign/page">
              <p>
                <i class="far fa-calendar-alt"></i>
                과제
              </p>
            </a>
          </nav>
            `

            navBar_contatiner.innerHTML = navBarE
        }else{
            const navBarE = `
            <nav class="navbar">
            <a href="/auth/login">
              <i class="fas fa-key">
                <p>LOGIN</p>
              </i>
            </a>
            <a href="/auth/join">
              <i class="fas fa-sign-in-alt">
                <p>SIGN UP</p>
              </i>
            </a>
            <a href="/grade/rest">
              <p>
                <i class="fas fa-school"></i>
                잔여학점
              </p>
            </a>
            <a href="/grade/average">
              <p>
                <i class="fas fa-book"></i>
                평균학점
              </p>
            </a>
            <a href="/assign/page">
              <p>
                <i class="far fa-calendar-alt"></i>
                과제
              </p>
            </a>
          </nav>
            `
            navBar_contatiner.innerHTML = navBarE
        }
    }
});