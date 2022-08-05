'use strict';

// let keys = ['b','c','d'];
let btns = document.getElementsByClassName('plusbtn');
let btn_keys = [];
function init(){
    btns = document.getElementsByClassName('plusbtn');
    btn_keys = [];
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
    // console.log(btns);
}
init();
// chgProd(1);




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
    init();
    document.getElementById('test').innerHTML = null;
    // console.log(btn_keys);
    btn_keys.forEach(v => {
        document.getElementById(v).disabled = false;
    });
    sessionStorage.clear();
}

function toggle(key){
    let plusbtn = document.getElementById(key);
    // if(plusbtn!=undefined){
        if(sessionStorage.getItem(key)==undefined){
            plusbtn.disabled = false;
        }else{
            plusbtn.disabled = true;
        }
    // }
}

function chgProd(page){
    // $("#r").on('click',function(){$("#inProducts").load(`./products.html #inProducts${page}`);});
    $("#inProducts").load(`./products.html #inProducts${page}`);
    // $("#r").trigger('chg');
    return 'chg';
    // document.getElementById("r").addEventListener('click',()=>{
    //     init();
    //     $("#r").off('click');
    // });
    
    // $("#inProducts").load(window.location.href + ' #inProducts');
    // let t = document.getElementById('inProducts').innerHTML;
    // console.log(t);
    // $(document).ready(function(){

    //     init();
    // });
    // $(this).trigger("chgd");
}

// function e(){
    // $("#r").on({'chg':()=>{init();}});
// }

// $("#r").bind('click',function(){$("#inProducts").load(`./products.html #inProducts${page}`);});


