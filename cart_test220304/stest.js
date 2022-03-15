'use strict';

// let keys = ['b','c','d'];
let btns = document.getElementsByClassName('plusbtn');
let btn_keys = [];
for(let i=0;i<btns.length;i++){
    btn_keys[i] = btns[i].getAttribute('id');
}
console.log(btn_keys);

if(sessionStorage.foo!=undefined){
    document.getElementById('test').innerHTML = sessionStorage.foo;
    btn_keys.forEach(v => {
        toggle(v);
    });
}



function plus(key,val,img_src){
    sessionStorage.setItem(key,val);
    let data=`<div class="inCart"><img src="${img_src}">${val}
        <button onclick="ex('${key}');">x</button></div>`;
        //ex()의 인자를 문자열로 받아야 함에 주의
    document.getElementById('test').innerHTML += data;
    sessionStorage.foo = document.getElementById('test').innerHTML;
    toggle(key);
}


function ex(key){
    sessionStorage.removeItem(key);
    let a = event.currentTarget.parentNode;
    let b = a.parentNode;
    console.log(a);
    b.removeChild(a);
    sessionStorage.foo = document.getElementById('test').innerHTML;
    toggle(key);
    if(sessionStorage.foo===''){
        sessionStorage.clear();
    }
}

function testClear(){
    document.getElementById('test').innerHTML = null;
    btn_keys.forEach(v => {
        document.getElementById(v).disabled = false;
    });
    sessionStorage.clear();
}

function toggle(key){
    let plusbtn = document.getElementById(key);
    if(plusbtn!=undefined){
        if(sessionStorage.getItem(key)==undefined){
            plusbtn.disabled = false;
        }else{
            plusbtn.disabled = true;
        }
    }
}


