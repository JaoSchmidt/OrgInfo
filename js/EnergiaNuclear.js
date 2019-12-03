'use strict'
let context = document.getElementById("EnergiaVersusUsinas").getContext('2d');
let options = {
    maintainAspectRatio: false,
    responsive:true,
    scales:{
        yAxes:[{
            id: "normal",
            scaleLabel: {
                display: true,
                labelString: 'GW & Número de Reatores'
            }
        }]
    },
    tooltips:{
        mode:'nearest',
        axis:'x',
        intersect:false
    }
        
};


////Abrindo arquivos Json 
let JsonString = '';
let requestURL = "https://api.myjson.com/bins/bw8je";
let request = new XMLHttpRequest();
request.open('GET',requestURL);
request.responseType=".json";
request.send();
////////
let EnergiaPorPais = [];
let ReatoresPorPais = [];
let label=[];
let Coeficiente=[];
request.onload = function(){
    JsonString = request.response;
    let obj = JSON.parse(JsonString);
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            ReatoresPorPais.push(obj[key][0]);
            EnergiaPorPais.push(obj[key][1]/1000);
            label.push(key);
            Coeficiente.push(obj[key][1]/(obj[key][0]*1000));
        }
    }
    executarGrafico();
}

function executarGrafico(){
    let newChart = new Chart(context,{
        type: 'bar',
        data: {
            labels:label,
            datasets:[{
                label: 'Energia em GW',
                data: EnergiaPorPais,   
                backgroundColor:'rgba(0,99,132,0.5)',
                yAxisID:"normal"
            },{
                label: 'Número de reatores',
                data: ReatoresPorPais,
                backgroundColor:'rgba(0,150,132,1)',    
                yAxisID:"normal"
            }]
        },
        options: options
    })
}
