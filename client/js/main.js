const assign_container = document.querySelector('.assign_container');
const average_contatiner = document.querySelector('.average_score');

const paintAssignComponent = (data) =>{
    let { id, subjectName, deadline, detail } = data;
    deadline = deadline.split('T')[0];

    const elem = `
    <div id=${id} class="one">
    <p>${subjectName}</p>
    <p>${deadline}</p>
    <p>${detail}</p>
    </div>
    `
    assign_container.innerHTML += elem;
}

const paintAverageComponent = ()=>{
    average_contatiner.innerHTML = ""

    axios({
        method:"GET",
        url: '/grade/get/scores',
    }).then((res)=>{
        return res.data.values
    }).then((res)=>{
        let { allScoreSum, allGradeSum } = res
        allScoreSum = parseFloat(allScoreSum);
        allGradeSum = parseInt(allGradeSum);
        const average = (allScoreSum/allGradeSum).toFixed(3);

        const elem = `
        <h1>평균 학점 계산</h1>
        <p>전체평점: ${average}/4.5</p>
        <p>취득학점: ${allGradeSum}</p>
        <p>합: ${allScoreSum}</p>
        `

        average_contatiner.innerHTML = elem;
        
    }).catch(error=>{
        console.log(error);
        // throw new Error(error);
    });
}

function init(){
    paintAverageComponent();

    assign_container.innerHTML = "";
    axios({
        method:"GET",
        url: '/assign/get/limit',
    }).then((res)=>{
        return res.data
    }).then((res)=>{
        Array.from(res, (data)=>{
            paintAssignComponent(data);
        })
    }).catch(error=>{
        console.log(error);
        throw new Error(error);
    });
}

init();
