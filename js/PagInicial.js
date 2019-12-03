//'use strict'
let context = document.getElementById("MatrizEnergetica").getContext('2d');
let context2= document.getElementById("MatrizEnergeticaColunas").getContext('2d');

/////////funções úteis
Array.prototype.reverse=function(){
    let temp;
    let tempArray = this.slice();
    for (let i = 0; i < tempArray.length/2; i++) {
        temp=tempArray[i];
        tempArray[i]=tempArray[tempArray.length-i-1];
        tempArray[tempArray.length-i-1]=temp;
    }
    return tempArray;
}
////////////Abrindo arquivos Json
let JsonString='';
let requestURL = "https://api.myjson.com/bins/vz27y";
let request = new XMLHttpRequest();
request.open('GET',requestURL);
request.responseType=".json";
request.send();
////////
let _labels=[];
let _backgroundColor=[];
class data{
    constructor(ano){
        this.datasets=[{
            label:"Matriz energética em "+ano,
            data:[],
        }]
    }
    static set backgroundColor(a){
        this._backgroundColor=a;
    }
    static get backgroundColor(){
        return this._backgroundColor;
    }
    static set labels(a){
        this._labels=a;
    }
    static get labels(){
        return this._labels;
    }
}
data.backgroundColor=["#0a0a0a",'#074b5e','#204b96','#07b5b5',"#adedda","#ab7811",
'#0a5c12','#e8e81a','#52030f','#2a5e18','#7d7d42',"#757575","#6a1ec7"]
data.labels=["Coal","Natural gas","Hydro","Nuclear","Wind","Oil","Biofuels","Solar PV","Waste",
"Geothermal","Solar thermal","Other sources","Tide"];
var yearData=[];
var inicialData=[];
request.onload = function(){
    JsonString=request.response;
    var obj=JSON.parse(JsonString);
    let i=0;
    for (let key in obj) {
        if(obj.hasOwnProperty(key)){//key = ano
            yearData[i] = new data(key);
            if(key=="2017"){
                inicialData=new data(key);
            }
            for(let innerKey in obj[key]){
                if(obj[key].hasOwnProperty(innerKey)){//innerLey = cada fonte de energia
                    yearData[i].datasets[0].data.push(obj[key][innerKey])
                    if(key=="2017"){
                        inicialData.datasets[0].data.push(obj[key][innerKey]);
                    }
                }
            }
        }
        i++
    }
    var a = [1,2,3,4,5,6,7];
    console.log(a);
    console.log(a.reverse());
    console.log(a);
    gerarGrafico();
}
function buttonRight(){
    updateGraphics("+1");
}
function buttonLeft(){
    updateGraphics("-1")
}
var pizzaChart;
var barChart;
function gerarGrafico(){
    barChart = new Chart(context2,{
        type:'bar',
        data:{
            labels:data.labels.reverse(),
            datasets:[{
                label:inicialData.datasets[0].label,
                data:inicialData.datasets[0].data.reverse(),
                backgroundColor:data.backgroundColor.reverse()
            }]
        },
        options:{
            title:{
                display:false,
            },
            legend:{
                display:false
            },
            tooltips:{
                mode:'nearest',
                axis:'x',
                intersect:false
            }
        }
    })
    pizzaChart = new Chart(context,{
        type:'pie',
        data:{
            labels:data.labels,
            datasets:[{
                label:inicialData.datasets[0].label,
                data:inicialData.datasets[0].data,
                backgroundColor:data.backgroundColor
            }]
        },
        options:{
            maintainAspect: false,
            responsive: true,
            legend:{
                display:true,
                position:'right',
                labels:{
                    usePointStyle:true
                }
            },
            tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = Math.floor(((currentValue/total) * 10000)+0.5)/100;  
                    return currentValue +" (or "+percentage + "%)";
                    }
                }
            }
        }
    })
}
var anoAtual=6;
var solucaoRapidaProTitulo =[1990,1995,2000,2005,2010,2015,2017];
function updateGraphics(key){//dá update no gráfico depois da animação
    if(key==="+1"&&anoAtual<6){
        anoAtual++;
        pizzaChart.data.datasets[0].data = yearData[anoAtual].datasets[0].data;
        pizzaChart.options.title.text=yearData[anoAtual].datasets[0].label;
        barChart.data.datasets[0].data = yearData[anoAtual].datasets[0].data.reverse();
        barChart.data.datasets[0].label=yearData[anoAtual].datasets[0].label;
    }else if(key==="-1"&&anoAtual>0){
        anoAtual--;
        pizzaChart.data.datasets[0].data = yearData[anoAtual].datasets[0].data;
        pizzaChart.options.title.text=yearData[anoAtual].datasets[0].label;
        barChart.data.datasets[0].data = yearData[anoAtual].datasets[0].data.reverse();
        barChart.data.datasets[0].label=yearData[anoAtual].datasets[0].label;
    }
    document.getElementById("title").innerHTML="Matriz energética no ano "+solucaoRapidaProTitulo[anoAtual]+" em Gwh"
    pizzaChart.update();
    barChart.update()
}