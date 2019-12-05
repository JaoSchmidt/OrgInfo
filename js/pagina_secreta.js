/////////////
//Coisas que ainda precisam ser feitas:
//1.O máximo valor será a altura máxima sempre no canvas(feito)
//2.ordenar em ordem crescente(feito)
//criar canvas de gráfico linear
/////////////
console.clear();
const DistanciaIntervalo = 10;
var canvas1 = document.getElementById("canvas1");
canvas1.width = window.innerWidth*2/3;
canvas1.height = window.innerHeight;
style = canvas1.style ="border:1px solid #000000";
var context = canvas1.getContext('2d');
context.save();
let f=true;//precisa ser substiuido


///////////////////////////////////abrir arquivos json
var theJson = '';
let requestURL = "https://api.myjson.com/bins/8kdey";
let request = new XMLHttpRequest();
request.open('GET',requestURL);
request.responseType = ".json";
request.send(); 
request.onload = function() {
    theJson = request.response;
    let theObj = JSON.parse(theJson);
}

////////funções que serão usadas
function retorneArrayExcetoUltimo(array){//retorna o array exceto o ultimo elemento
    array.pop();
    return array;
}
function convert(n) {//retorna a ordem de magnitude +1
    var order = Math.floor(Math.log(n) / Math.LN10
    + 0.000000001); // because float math sucks like that
    return order+1;
}
ordemCrescente = function(array,arrayDesc){//retorna array em ordem crescente
    let temp;
    let tempString;
    for (let j = 1; j < array.length; j++) {
        for (let i = 0; i < array.length-j; i++) {
            if(array[i]>array[i+1]){
                temp = array[i];
                array[i]=array[i+1];
                array[i+1]=temp;
                tempString=arrayDesc[i];
                arrayDesc[i]=arrayDesc[i+1];
                arrayDesc[i+1]=tempString;
            }
        }
    }
    return array;
}
rotateX = function(angle,a,b){
    return a*Math.cos(angle)+b*Math.sin(angle);
}
rotateY=function(angle,a,b){
    return b*Math.cos(angle)-a*Math.sin(angle);
}
maxFromArray=function(array){
    let max=array[0];
    for (let i = 1; i < array.length; i++) {
        if(array[i]>max){
            max=array[i]
        }
    }
    return max;
}
//criar graficos////////////////////////////////////////

function GraphicWithDescribedX(values,valuesDescr,ordenarPorMaior){
    if(ordenarPorMaior==true){
        this.values = ordemCrescente(values,valuesDescr);//valores porém em ordem crescente
    }else{
        this.values = values;
    }
    let xPosition = 30;//posição x
    let yPosition = canvas1.height-100;//posição y
    let larguraElementoGrafico=(canvas1.width-DistanciaIntervalo*(1+values.length)-xPosition)/values.length;
    let larguraBasica = larguraElementoGrafico+DistanciaIntervalo;//largura de um elemento somado com o intervalo entre ele e o próximo elemento
    let alpha=yPosition/maxFromArray(values);//a altura do maior elemento será a aluta máxima com essa constante
    let n=18;//número de linhas
    let m=maxFromArray(values)/12;//divisão do valor total
    //métodos
    this.drawGraphic = function(valoresParametro){
        alpha=yPosition/maxFromArray(valoresParametro);
        context.font = "20px Arial";
        for (let i = 0; i < valoresParametro.length; i++) {
            context.fillStyle ="#696969";
            context.fillRect(xPosition+larguraBasica*i,yPosition,larguraElementoGrafico,-valoresParametro[i]*alpha);
            context.fillStyle = "white";
            context.fillText(Math.round(valoresParametro[i]),xPosition+larguraBasica*i+larguraElementoGrafico/2-20*(0.56)*(1/2)*convert(valoresParametro[i]),yPosition-valoresParametro[i]*alpha+20);
        }
        context.resetTransform();

    }
    this.drawGRaphicDescr = function(angle){//coloca a descrição de cada elemento do gráfico
        context.rotate(angle);
        context.fillStyle = 'black';
        context.font = "20px Arial";
        for (let i = 0; i < values.length; i++) {
            context.fillText(valuesDescr[i],rotateX(angle,xPosition+larguraBasica*i,yPosition+15),rotateY(angle,xPosition+larguraBasica*i,yPosition+15));
        }
        context.resetTransform();
    }
    this.drawLines = function(Max){
        n=Max/m;
        while(n>10 || n<6){
            n = Max/m;
            if(n>10){
                m++;
            }else if(n<6){
                m--;
            }
        }
        k = yPosition*m/Max
        
        context.strokeStyle = "#D3D3D3";
        context.fillStyle = "grey";
        context.beginPath();
        for (let i = 0; yPosition/k>i; i++) {
            context.moveTo(xPosition-DistanciaIntervalo,yPosition-i*k);
            context.lineTo(innerWidth,yPosition-i*k);
            context.stroke();
            context.font = "10px Arial";
            context.fillText(Math.round(i*m),xPosition-20,yPosition-i*k + 20);
        }
        context.resetTransform();
    }
    animarGrafico = function(oldGraphic,newGraphic){//mostra a animação entre o grafico velho e novo
        let temp=[];
        for (let i = 0; i < oldGraphic.values.length; i++) {
            temp.push(oldGraphic.values[i]);
        }
        context.clearRect(0, yPosition, xPosition+larguraBasica*values.length, canvas1.height);
        newGraphic.drawGRaphicDescr(Math.PI/4);
        let deltaS=[];
        let valorQualquer;
        let sensorDePadara=0;
        for (let i = 0; i < oldGraphic.values.length; i++) {
            deltaS.push(oldGraphic.values[i]-newGraphic.values[i]);
        }
        function fun(){
            if(sensorDePadara<100) {
                requestAnimationFrame(fun);
            }
            context.clearRect(0, 0, innerWidth, yPosition);//limpa o frame anterior(Xo,Yo,Xf,Yf)
            for (let i = 0; i < temp.length; i++) {
                if(deltaS[i]>0){
                    if(temp[i]>newGraphic.values[i]){
                        temp[i] -=deltaS[i]/20;
                    }
                }else{
                    if(temp[i]<newGraphic.values[i]){
                        temp[i] -=deltaS[i]/20;
                    }
                }
                oldGraphic.drawLines(maxFromArray(temp));
                oldGraphic.drawGraphic(temp);
                
            }
            if(valorQualquer==temp[0]){//faz a animação parar, evitando processos descnecessários
                sensorDePadara++;
            }else if(valorQualquer!=temp[0]){
                sensorDeParada=0;
                valorQualquer=temp[0];
            }
        }
        fun();
    }
}
function getMousePos(canvas,event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: x.clientX - rect.left,
        y: y.clientY - rect.top
    };  
}
canvas1.addEventListener('mousedown',function(event){
    var mousePos = getMousePos(canvas1,event);
    
},false);
function button(){
    if(f==true){
        animarGrafico(graphic1,graphic2);
        f=false;
    }else if(f==false){
        animarGrafico(graphic2,graphic1);
        f=true
        
    }
}
function button2(){
    console.log(graphic1.values);
}
function button3(){
    console.log(graphic2.values);
}

function jsonPropertyNameToArray(graf){
    let key, array=[];
    for(key in graf){
        if(graf.hasOwnProperty(key)){
            array.push(key);
        }
    }
    array.pop();//retira otherProperties
    return array;
}
function jsonDescriptionToArray(graf){
    let key, array=[];
    for(key in graf){
        if(graf.hasOwnProperty(key)&&key!="OtherProperties"){
            array.push(graf[key]);
        }
    }
    return array;
}

var graphic1 = new GraphicWithDescribedX(
    [ 35, 20, 50, 30, 120, 150, 70, 65 ],
    [ "area1", "area2", "area3", "area4", "area5", "area6", "area7", "area8" ],
    false
);
var graphic2 = new GraphicWithDescribedX(
    [35,50,90,105,12,243,32,142],
    ["area1", "area2", "area3", "area4","area5","area6","area7","area8"],
    false    
);
graphic1.drawLines(maxFromArray(graphic1.values));
graphic1.drawGraphic(graphic1.values);
graphic1.drawGRaphicDescr(Math.PI/4);