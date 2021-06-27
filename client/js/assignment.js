
const assignBtn = document.querySelector('.async_assign_btn');
const assignContent = document.querySelector('.assginment_content');


const getAssignElement = (data) =>{
    const { content , date, subjectName } = data;

    const box = document.createElement('div');
    box.className = 'assginment_content_raw';

    const content_div = document.createElement('div');
    content_div.className = 'assginment_content_law_one';
    content_div.innerHTML = `<p>${content}</p>`;

    const date_div = document.createElement('div');
    date_div.className = 'assginment_content_law_two';
    date_div.innerHTML = `<p>${date}</p>`;

    const name_div = document.createElement('div');
    name_div.className = 'assginment_content_raw_content';
    name_div.innerHTML = `<p>${subjectName}</p>`;

    const check = document.createElement('div');
    const icon = document.createElement('i');
    icon.className = 'fas fa-check-square';
    check.className = 'assginment_content_raw_three';
    check.appendChild(icon);

    
    box.appendChild(name_div);
    box.appendChild(date_div);
    box.appendChild(content_div);
    box.appendChild(check);

    return box;
}

assignBtn.addEventListener('click', (e)=>{
    const id = document.querySelector('.assign_id').value;
    const pw = document.querySelector('.assign_pw').value;

    fetch('/assign/async', {
        method : 'POST',
        mode: 'cors',  
        credentials: 'same-origin',  
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', 
        referrer: 'no-referrer',  
        body:  new URLSearchParams({
            id, pw
        })
    })
    .then((res)=>(res.json()))
    .then(res=>{
        console.log(res)
        Array.from(res, assignObj=>{
            const box = getAssignElement(assignObj);
            assignContent.appendChild(box);
        })
    })
})
