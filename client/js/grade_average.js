const select_scores = document.querySelector(".select_score");
const addBtn = document.querySelector('.grade_add_btn');
const select_years = document.querySelector('.select_year');
const assginment_order = document.querySelector('.assginment_order');
const subjectContent = document.querySelector('.assginment_content_contatiner');
const allAverageScoreE = document.querySelector('.grade_point');
const allGradeSumE = document.querySelector('.credits');
const allScoreSumE = document.querySelector('.allScoreSum');

const scores = ['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'D0', 'F']
const num_socres = [4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0]

const years = ['all', '1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2', 'other']


//                  { score , grade}
const updateScore = (obj, opt=false) => {
    let scoreSum = parseFloat(allScoreSumE.innerHTML);
    let gradeSum = parseInt(allGradeSumE.innerHTML);
    let score = parseFloat(obj.score);
    let grade = parseInt(obj.grade);
    
    if(opt){
        scoreSum -= score * grade;
        gradeSum -= grade;
    }else{
        scoreSum += score * grade;
        gradeSum += grade;
    }
    const average = (scoreSum / gradeSum).toFixed(3);

    console.log(scoreSum, gradeSum)
    allAverageScoreE.innerHTML = average;
    allScoreSumE.innerHTML = scoreSum;
    allGradeSumE.innerHTML = gradeSum;
}


const paintInfo = (data) =>{
    const { id, subjectTitle, grade, score, field, year} = data
    let check_btn = 'far fa-check-square';

    if(field == 'major'){
        check_btn = 'fas fa-check-square';
    }

    const elemDiv = document.createElement('div');
    elemDiv.id = id;

    const contentRaw = document.createElement('div');
    contentRaw.className = "assginment_content_law";

    const yearRaw =  document.createElement('div');
    const year_p = document.createElement('p');
    year_p.innerHTML = year;
    yearRaw.appendChild(year_p);

    const subjectTitleRaw =  document.createElement('div');
    const title_p = document.createElement('p');
    title_p.innerHTML = subjectTitle;
    subjectTitleRaw.appendChild(title_p);


    const gradeRaw =  document.createElement('div');
    gradeRaw.innerHTML = `<p>${grade}</p>`

    const scoreRaw =  document.createElement('div');
    scoreRaw.innerHTML = `<p>${score}</p>`

    const majorRaw =  document.createElement('div');
    majorRaw.innerHTML = ` <i class="${check_btn}"></i>`;

    const deleteRaw =  document.createElement('div');
    deleteRaw.className = "delete_grade_element";
    deleteRaw.innerHTML = '<i class="far fa-trash-alt"></i>';

    deleteRaw.addEventListener('click', (e)=>{
        updateScore({ score , grade}, true)

        fetch('/grade/remove', {
            method : 'POST',
            mode: 'cors',  
            credentials: 'same-origin',  
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', 
            referrer: 'no-referrer',  
            body:  new URLSearchParams({
                id, score , grade
            })
        })
        .then((res)=>(res.json()))
        .then(res=>{
            console.log(res)
            if(res.success){
                elemDiv.remove();
            }
        }).catch(err=>{
            console.error(err)
        })
    })

    elemDiv.appendChild(contentRaw);
    contentRaw.appendChild(yearRaw);
    contentRaw.appendChild(subjectTitleRaw);
    contentRaw.appendChild(gradeRaw);
    contentRaw.appendChild(scoreRaw);
    contentRaw.appendChild(majorRaw);
    contentRaw.appendChild(deleteRaw);

    subjectContent.appendChild(elemDiv)
}



const paintInfos = (query)=>{
    subjectContent.innerHTML = "";

    fetch(query, {
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
        if(res.success){
            const values = res.values;
            Array.from(values, value=>{
                paintInfo(value);
            })
        }
    })
}

const getScore = ()=>{
    fetch('/grade/get/scores', {
        method : 'GET',
        mode: 'cors',  
        credentials: 'same-origin',  
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', 
        referrer: 'no-referrer',  
    })
    .then((res)=>(res.json()))
    .then(res=>{
        if(res.success && res.values){
            const value = res.values;
            const { allScoreSum, allGradeSum } = value;
            const average = (allScoreSum / allGradeSum).toFixed(3);

            console.log( allScoreSum, allGradeSum, average)
            allAverageScoreE.innerHTML = average;
            allGradeSumE.innerHTML = parseInt(allGradeSum);
            allScoreSumE.innerHTML = allScoreSum;
        }else{
            console.log(res)
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
            updateScore({grade, score});
        }else{
            console.log(res)
        }
    })
    
})

const init = () => {
    subjectContent.innerHTML = "";
    allAverageScoreE.innerHTML="0";
    allScoreSumE.innerHTML="0";
    allGradeSumE.innerHTML="0";

    select_scores.innerHTML = ''
    for(let index=0; index<scores.length; index++){
        const elem = `<option value=${num_socres[index]}>${scores[index]}</option>`
        select_scores.innerHTML += elem
    }
    

    assginment_order.innerHTML = ''
    select_years.innerHTML = ''
    for(let index=0; index<years.length; index++){
        const year = years[index];
        if(index!=0){
            const elem = `<option value=${year}>${year}</option>`
            select_years.innerHTML += elem
        }
        assginment_order.innerHTML += `<div class="assginment_order_box" id=${year}><p>${year}</p></div>`
    }

    const years_element = document.querySelectorAll('.assginment_order_box');
    Array.from(years_element,(elem, index)=>{
        elem.addEventListener("click", (e)=>{
            paintInfos(`/grade/get/by/${elem.id}`);
        })
    })
}



init();
paintInfos('/grade/get/by/all');
getScore();