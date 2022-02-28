'use strict';

let i,j,k = 0;

function circles(forNum){
    for(i=0;i<7;i++){
        document.getElementById(forNum).insertAdjacentHTML
            ('beforeend',`<div class=${forNum}>　</div>`);
        if(i==5 && forNum=='allnums'){
            document.getElementById(forNum).insertAdjacentHTML('beforeend','<span id="plus">＋</span>');
        }else if(i>4 && forNum!=='allnums'){
            break;
        }
    }
}
circles('allnums');
circles('allmynums');

//checkbox
for(i=1;i<46;i++){
    document.getElementById('mynum').insertAdjacentHTML
        ('beforeend',`<label><input class="mynum" type="checkbox" name="mynum" value="${i}"><span>${i}</span></label>`);
    if(i%5==0){
        document.getElementById('mynum').insertAdjacentHTML('beforeend','<hr>');
    }
}


var mynumber = new Array();
// let mynumber = [2,5,8,14,31,3];
const allnums = document.getElementsByClassName('allnums');
const allmynums = document.getElementsByClassName('allmynums');
const lottonum = new Array();
let msg = document.getElementById('result');


function resetNums(forNum){
    for(i=0;i<forNum.length;i++){
        forNum[i].style.background = '#eee';
        forNum[i].style.color = 'black';
        forNum[i].innerHTML = '　';
    }
}


function lot(){
    for(i=0;i<7;i++){ //1~45
        allnums[i].style.background = '#eee';
        lottonum[i] = Math.floor((Math.random()*45)+1);
        for(j=0;j<i;j++){
            if(lottonum[i]==lottonum[j]){
                i--;
            }
            
        }
        if(i==5){
            for(j=0;j<6;j++){
                for(k=0;k<5-j;k++){
                    if(lottonum[k]>lottonum[k+1]){
                        let tmp;
                        tmp=lottonum[k+1];
                        lottonum[k+1]=lottonum[k];
                        lottonum[k]=tmp;
                    }
                }
            }
        }
    }
}
lot();

function printNum(forNum,num){
    for(i=0;i<num.length;i++){
        forNum[i].innerHTML = num[i];
    }
    console.log(num);
}


//onsubmit
document.getElementById('lotto').onsubmit = function(){
    console.clear();
    mynumber=[];

    const query = 'input[name="mynum"]:checked';
    const selected = document.querySelectorAll(query);
    selected.forEach((n,idx)=>{
        mynumber[idx] = parseInt(n.value);
    });
    
    if(mynumber.length == 6){
        resetNums(allnums);
        resetNums(allmynums);
        printNum(allnums,lottonum);
        printNum(allmynums,mynumber);
        count();
    }else{
        alert('6개 숫자만 입력 가능합니다');
    }

    return false;
}

//onreset
document.getElementById('lotto').onreset = function(){
    console.clear();
    mynumber = [];
    msg.innerHTML = '숫자 6개를 선택 후<br>확인 버튼을 눌러주세요';
    msg.style.background = 'white';
    resetNums(allnums);
    resetNums(allmynums);
}


//result
function printResult(result,con='축하합니다!',bgcolor='antiquewhite'){
    console.log(result);
    msg.innerHTML = `${con}<br>${result}`;
    msg.style.background = bgcolor;
}

function hit(forNum,p,bgcolor='green'){
    forNum[p].style.background = bgcolor;
    forNum[p].style.color = 'white';
}

function count(){
    let cnt = 0;
    let bonus = false;
    
    for(i=0;i<6;i++){
        for(j=0;j<6;j++){
            if(lottonum[i]==mynumber[j]){
                hit(allnums,i);
                hit(allmynums,j);
                cnt++;
            }
        }
    }


    if(cnt==5){
        for(i=0;i<6;i++){
            if(lottonum[6]==mynumber[i]){
                hit(allnums,6,'blue');
                hit(allmynums,i,'blue');
                bonus = true;
            }
        }
        if(bonus==true){
            printResult('2등 48,446,268원');
        }else{
            printResult('3등 1,289,676원');
        }
    }else{
        switch(cnt){
            case 3:
                printResult('5등 5000원');
                break;
            case 4:
                printResult('4등 50,000원');
                break;
            case 6:
                printResult('1등 3,088,449,563원');
                break;
            default:
                printResult('미당첨','','white');
                break;
        }
    }

    console.log(`${cnt}개, ${bonus}`);
}
