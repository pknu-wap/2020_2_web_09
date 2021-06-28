const select_scores = document.querySelector(".select_score");
const addBtn = document.querySelector('.grade_add_btn');
const select_years = document.querySelector('.select_year');
const assginment_order = document.querySelector('.assginment_order');
const subjectContent = document.querySelector('.assginment_content_contatiner');

const scores = ['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'D0', 'F']
const num_socres = [4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0]

const years = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2', 'other']


{/* <p>교양</p>
<p>자유선택</p>
<p>그외</p> */}

const getInfoElement = (data) =>{
    const { id, subjectTitle, grade, score, field, year} = data
    let check_btn = 'far fa-check-square';

    if(field == 'major'){
        check_btn = 'fas fa-check-square';
    }

    const elem = `
    <div id="${id}">
        <div class="assginment_content_law">

        <div class="assginment_content_law_year"><p>${year}</p></div>

        <div class="assginment_content_law_title"><p>${subjectTitle}</p></div>

        <div class="assginment_content_law_point"><p>${grade}</p></div>

        <div class="assginment_content_law_grade">
            <p>${score}</p>
        </div>

        <div class="assginment_content_law_major">
            <i class="${check_btn}"></i>
        </div>
    </div>
    `
    return elem;
}


const paintInfo = (info) =>{
    try{
        subjectContent.innerHTML += getInfoElement(info);
    }catch(err){
        console.log(err)
    }
}

const paintInfos = ()=>{
    fetch('/grade/get/all', {
        method : 'GET',
        mode: 'cors',  
        credentials: 'same-origin',  
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', 
        referrer: 'no-referrer'
    })
    .then((res)=>(res.json()))
    .then(res=>{
        console.log(res)
        if(res.success){
            const values = res.values;
            Array.from(values, value=>{
                paintInfo(value)
            })
        }
    })
}

addBtn.addEventListener("click", e=>{
    const year = document.querySelector('.select_year').value;

    const subjectTitle = document.querySelector('.grade_add_title').value;

    const grade = document.querySelector('.grade_add_grade').value;

    const score = document.querySelector('.select_score').value;

    const field = document.querySelector('.select_field').value;

    
    if(!year|!subjectTitle | !grade | !score | !field) return;

    // console.log(year, subjectTitle, grade, score, field)

    fetch('/grade/save', {
        method : 'POST',
        mode: 'cors',  
        credentials: 'same-origin',  
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', 
        referrer: 'no-referrer',  
        body:  new URLSearchParams({
            year, subjectTitle, grade, score, field
        })
    })
    .then((res)=>(res.json()))
    .then(res=>{
        if(res.success){
            paintInfo(res)
        }else{
            console.log(res)
        }
    })
    
})


const init = () => {
    subjectContent.innerHTML = "";

    select_scores.innerHTML = ''
    for(let index=0; index<scores.length; index++){
        const elem = `<option value=${num_socres[index]}>${scores[index]}</option>`
        select_scores.innerHTML += elem
    }
    

    assginment_order.innerHTML = ''
    select_years.innerHTML = ''
    for(let index=0; index<years.length; index++){
        const year = years[index];
        const elem = `<option value=${year}>${year}</option>`
        select_years.innerHTML += elem
        assginment_order.innerHTML += `<div class="assginment_order_box" id=${year}><p>${year}</p></div>`
    }

    const years_element = document.querySelectorAll('.assginment_order_box');
    Array.from(years_element,(elem, index)=>{
        elem.addEventListener("click", (e)=>{
            console.log(elem.id)
        })
    })
}

init();
paintInfos();