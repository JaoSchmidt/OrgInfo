'use strict'

let context2 = document.getElementById("CoeficienteDeRendimento").getContext('2d');
let options2={
    maintainAspectRation: false,
    responsive:true,
    title:{
        display:true,
        text:'Unit Capability Factor (2018)'
    },
    legend:{
        display:false,
    },
    scales:{
        yAxes:[{
            id:'normal',
            scaleLabel:{
                display:true,
                labelString:"Fator de Capacidade por unidade em 2018"
            },
            ticks:{
                beginAtZero:true
            }
        }]
    },
    tooltips:{
        mode:'nearest',
        axis:'x',
        intersect:false
    },
    elements:{
        line:{
            tension:0
        }
    }
};

////funções úteis
function ordemCrescente(array,array2,array3){//retorna array em ordem crescente
    let temp;
    let tempString;
    let tempString2;
    for (let j = 1; j < array.length; j++) {
        for (let i = 0; i < array.length-j; i++) {
            if(array[i]>array[i+1]){
                temp = array[i];
                array[i]=array[i+1];
                array[i+1]=temp;
                tempString=array2[i];
                array2[i]=array2[i+1];
                array2[i+1]=tempString;
                if(array3!=undefined){
                    tempString2=array3[i];
                    array3[i]=array3[i+1];
                    array3[i+1]=tempString2;
                }
            }
        }
    }
    return array;
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
////Abrindo arquivos Json 
let JsonString2 = '';
let requestURL2 = "https://api.myjson.com/bins/16r5o6";
let request2 = new XMLHttpRequest();
request2.open('GET',requestURL2);
request2.responseType=".json";
request2.send();
////////////


function data2(ano){
    this.labels=[];
    this.datasets=[{
        label:"Fator de Capacidade por unidade em "+ano,
        data:[],
        borderColor:[],
        borderWidth:1
    }];
}

var anoAtual=2018;
var dataInicial=new data2(2018);
var ano2016=new data2(2016);
var ano2017=new data2(2017);
var ano2018=new data2(2018);
request2.onload = function(){
    JsonString2 = request2.response;
    var obj2 = JSON.parse(JsonString2);
    for(let key in obj2){
        if(obj2.hasOwnProperty(key)){
            dataInicial.labels.push(key);
            dataInicial.datasets[0].data.push(obj2[key]["2018"]);
            ano2018.labels.push(key);
            ano2018.datasets[0].data.push(obj2[key]["2018"]);
            ano2017.labels.push(key);
            ano2017.datasets[0].data.push(obj2[key]["2017"]);
            ano2016.labels.push(key);
            ano2016.datasets[0].data.push(obj2[key]["2016"]);
            var cor = getRandomColor();
            dataInicial.datasets[0].borderColor.push(cor);
            ano2018.datasets[0].borderColor.push(cor);
            ano2017.datasets[0].borderColor.push(cor);
            ano2016.datasets[0].borderColor.push(cor);
        }
    }
    ordemCrescente(ano2018.datasets[0].data,ano2018.labels);
    ordemCrescente(ano2017.datasets[0].data,ano2017.labels);
    ordemCrescente(ano2016.datasets[0].data,ano2016.labels);
    ordemCrescente(dataInicial.datasets[0].data,dataInicial.labels,dataInicial.borderColor);
    executarGraficoPizza();
    executarGrafico();
}
var pizza;
function executarGraficoPizza(){
    pizza = new Chart(context2,{
        type:'line',
        data:dataInicial,
        options:options2
    })
}
function buttonRight(){
    updateGraphics("+1");
}
function buttonLeft(){
    updateGraphics("-1")
}
function updateGraphics(key){
    if(key==="+1"){
        if(anoAtual==2017){
            anoAtual=2018;
            pizza.data.datasets[0].data=ano2018.datasets[0].data;
            pizza.labels=ano2018.labels;
            pizza.borderColor=ano2018.borderColor;
            pizza.options.scales.yAxes[0].scaleLabel.labelString = "Fator de Capacidade por unidade em 2018";
            pizza.options.title.text ='Unit Capability Factor (2018)';
        }else if(anoAtual==2016){
            anoAtual=2017;
            pizza.data.datasets[0].data=ano2017.datasets[0].data;
            pizza.labels=ano2017.labels;
            pizza.borderColor=ano2017.borderColor;
            pizza.options.scales.yAxes[0].scaleLabel.labelString = "Fator de Capacidade por unidade em 2017";
            pizza.options.title.text ='Unit Capability Factor (2017)';
        }
    }else if(key==="-1"){
        if(anoAtual==2018){
        anoAtual=2017;
            pizza.data.datasets[0].data=ano2017.datasets[0].data;
            pizza.labels=ano2017.labels;
            pizza.borderColor=ano2017.borderColor;
            pizza.options.scales.yAxes[0].scaleLabel.labelString = "Fator de Capacidade por unidade em 2017";
            pizza.options.title.text ='Unit Capability Factor (2017)';
        }else if(anoAtual==2017){
            anoAtual=2016;
            pizza.data.datasets[0].data=ano2016.datasets[0].data;
            pizza.labels=ano2016.labels;
            pizza.borderColor=ano2016.borderColor;
            pizza.options.scales.yAxes[0].scaleLabel.labelString = "Fator de Capacidade por unidade em 2016";
            pizza.options.title.text ='Unit Capability Factor (2016)';
        }
    }
    pizza.update();
}
