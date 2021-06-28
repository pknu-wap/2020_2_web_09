const assignAsyncBtn = document.querySelector('.async_assign_btn');
const assignContent = document.querySelector('.assginment_content');
const assignAddBtn = document.querySelector('.assign_add_btn');
const recentBtn = document.querySelector('.assginment_order_box');
const inputBtn = document.querySelector('.assginment_order_box_blank');

const getAssignElement = (data) =>{
    const { content , date, subjectName , id} = data;

    const box = document.createElement('div');
    box.id = id;
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
    icon.className = 'far fa-check-square';
    check.className = 'assginment_content_raw_three';
    check.appendChild(icon);
    check.addEventListener("click", (e)=>{
        icon.className = 'fas fa-check-square';

        fetch(`/assign/delete/${box.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
        })

        setTimeout(()=>{
            box.remove();
        }, 400);
    })

    
    box.appendChild(name_div);
    box.appendChild(date_div);
    box.appendChild(content_div);
    box.appendChild(check);

    return box;
}


const fetchAssigns = (order, cb)=>{
    fetch(`/assign/get/${order}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
    })
    .then((res)=>(res.json()))
    .then(assigns=>{
        return cb(null, assigns);
    })
    .catch(err=>{
        return cb(err, null);
    })
}


const paintAssigns = (order) =>{
    fetchAssigns(order, (err, assigns)=>{
        if(err) return ;
        assignContent.innerHTML = `
        <div class="assginment_content_title">
            <p>과목명</p>
            <p>날짜</p>
            <p>내용</p>
            <p>완료</p>
        </div>
        `
        Array.from(assigns, assign=>{
            try{
                console.log(assign)
                const obj = { 
                    content : assign.detail,
                    subjectName : assign.subjectName,
                    date : assign.deadline.split('T')[0],
                    id : assign.id
                }
                const elem = getAssignElement(obj);
                assignContent.appendChild(elem);
            }catch(err){
                console.log(err)
            }
        })
    })
}


assignAsyncBtn.addEventListener('click', (e)=>{
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


assignAddBtn.addEventListener("click", e=>{
    const subjectName = document.querySelector('.assign_add_title').value;
    const date = document.querySelector('.assign_add_date').value;
    const content = document.querySelector('.assign_add_content').value;
    fetch('/assign/save', {
        method : 'POST',
        mode: 'cors',  
        credentials: 'same-origin',  
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', 
        referrer: 'no-referrer',  
        body:  new URLSearchParams({
            subjectName, date, content
        })
    })
    .then((res)=>(res.json()))
    .then(res=>{
        console.log(res)
        paintAssigns(res)
    })
    .catch(err=>{
        console.log(err)
    })
})

recentBtn.addEventListener('click', (e)=>{    
    paintAssigns('recent')
})


inputBtn.addEventListener('click', (e)=>{    
    paintAssigns()
})

paintAssigns()