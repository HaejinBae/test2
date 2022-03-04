'use strict';

if(sessionStorage.foo!=undefined){
    document.getElementById('test').innerHTML = sessionStorage.foo;
    for(let i=0;i<3;i++){
        toggle(i);
    }
}

function plus(key,val){
    switch(key){
        case 0: val=`<div>${val}<img src="./images/bear.jpg">
        <button onclick="ex(${key});">x</button></div>`; break;
        case 1: val=`<div>${val}<img src="./images/mush1.png">
        <button onclick="ex(${key});">x</button></div>`; break;
        case 2: val=`<div>${val}<img src="./images/Frame0.png">
        <button onclick="ex(${key});">x</button></div>`; break;
    }
    sessionStorage.setItem(key,val);
    document.getElementById('test').innerHTML += sessionStorage.getItem(key);
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
    for(let i=0;i<3;i++){
        document.getElementById(`${i}`).disabled = false;
    }
    sessionStorage.clear();
}

function toggle(key){
    if(sessionStorage.getItem(key)==undefined){
        document.getElementById(`${key}`).disabled = false;
    }else{
        document.getElementById(`${key}`).disabled = true;
    }
}


