let context = document.getElementById("DailyEnergy").getContext('2d');

///funções uteis
///pegar arquivos json
let request = new XMLHttpRequest();
request.open('GET',"https://api.myjson.com/bins/judji");
request.responseType=".json";
request.send(); 
///algumas variaveis
let labels=[];
let sourcesData=[];
let sourcesColor=["#adedda",'#074b5e','#204b96',
'#912eb3','#6e6e6e','#07b5b5',"#0a0a0a","#757575"];
let sourcesNames=[];
request.onload = function(){
    var obj=JSON.parse(request.response);
    let foiFeitoUmaVez=false;
    for (let key in obj) {
        sourcesNames.push(key);
        if(obj.hasOwnProperty(key)){
            let temp=[];
            for(let innerKey in obj[key]){
                if(obj[key].hasOwnProperty(innerKey)){
                    if(!foiFeitoUmaVez){
                        labels.push(innerKey);
                    }
                    temp.push(obj[key][innerKey]);
                }
            }
            sourcesData.push(temp);
            foiFeitoUmaVez=true;
        }
    }
    executeGraphic();
}
let dataset = function(){
    let array=[];
    for (let i = 0; i < sourcesNames.length; i++) {
        let tempobj={
            label:sourcesNames[i],
            data:sourcesData[i],
            borderColor:sourcesColor[i],
            fill:false
        }
        array.push(tempobj);
    }
    return array;
}
function executeGraphic(){  
    let chart = new Chart(context,{
        type:'line',
        data:{
            labels: labels,
            datasets: dataset()
        },
        options: {
            elements:{
                line:{
                    tension:0
                },
                point:{
                    radius:0
                }
            },
            tooltips:{
                mode:'nearest',
                axis:'xy',
                intersect:false,
            }
        }
    })
}
