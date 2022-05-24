import React from "react";
import Board from "./Board";

export default class Game extends React.Component{
    constructor(props){
        super(props);

        let row=[];
        for(let j=0;j<8;j++){
            let col = [];
            for(let i=0;i<8;i++){
                if(j==1||j==6){
                    if(j==1){
                        col.push(
                            {camp:'black', value:'♟', piece:'pawn'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♙', piece:'pawn'}
                        );
                    }
                }else if((i==0||i==7)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♜', piece:'rook'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♖', piece:'rook'}
                        );
                    }
                }
                else if((i==1||i==6)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♞', piece:'knight'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♘', piece:'knight'}
                        );
                    }
                }
                else if((i==2||i==5)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♝', piece:'bishop'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♗', piece:'bishop'}
                        );
                    }
                }
                else if((j==0||j==7)&&i==3){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♛', piece:'queen'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♕', piece:'queen'}
                        );
                    }
                }
                else if((j==0||j==7)&&i==4){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♚', piece:'king'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♔', piece:'king'}
                        );
                    }
                }
                else{
                    col.push(
                        {camp:'', value:''}
                    );
                }
                // console.log(col[i]);
            }
            row.push(
                col
            );
        }
        
        // console.log(row);
        

        this.state = {
            // history: [{squares: Array(64).fill(null)}],
            history: [{squares: row}],
            selected:[],
            moveable:[],
            next: 'white'
        };
        console.log(this.state.history);
    }

    selectedPiece(p){
        const history=this.state.history;
        const current=history[0];
        let rival = (this.state.next=='white'? 'black':'white');
        //현재 선택한 칸의 좌표를 저장할 변수
        let po=[];
        //이동 가능한 칸의 좌표를 저장할 배열
        let movea=[];
        let unmovea=[];
        //선택한 말의 이동가능한 칸을 계산하는 함수
        //선택된 칸의 좌표만 받는것 문제
        var pawn_moveable = (xpos,ypos,camp,movea_space)=>{
            if(camp=='white'){
                if((ypos-1)>=0 && current.squares[ypos-1][xpos].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                    movea_space.push([ypos-1,xpos]);
                }
                // console.log(p[1]);
                if(ypos==6 && current.squares[ypos-1][xpos].value=='' 
                    && current.squares[ypos-2][xpos].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                        movea_space.push([ypos-2,xpos]);
                }
                // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
                if((ypos-1)>=0) { //폰의 한 칸 앞이 존재하고
                    console.log('pawn catch');
                    //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                    if(((xpos-1)>=0) && current.squares[ypos-1][xpos-1].camp=='black'){ 
                        console.log('front left');
                        movea_space.push([ypos-1,xpos-1]);
                    }
                    //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                    if(((xpos+1)<=7) && current.squares[ypos-1][xpos+1].camp=='black'){ 
                        console.log('front right');
                        movea_space.push([ypos-1,xpos+1]);
                    }
                }
            }else if(camp=='black'){
                if((ypos+1)<=7 && current.squares[ypos+1][xpos].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                    movea_space.push([ypos+1,xpos]);
                }
                // console.log(p[1]);
                if(ypos==1 && current.squares[ypos+1][xpos].value=='' 
                    && current.squares[ypos+2][xpos].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                        movea_space.push([ypos+2,xpos]);
                }
                // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
                if((ypos+1)<=7) { //폰의 한 칸 앞이 존재하고
                    console.log('pawn catch');
                    //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                    if(((xpos-1)>=0) && current.squares[ypos+1][xpos-1].camp=='white'){ 
                        console.log('front left');
                        movea_space.push([ypos+1,xpos-1]);
                    }
                    //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                    if(((xpos+1)<=7) && current.squares[ypos+1][xpos+1].camp=='white'){ 
                        console.log('front right');
                        movea_space.push([ypos+1,xpos+1]);
                    }
                }
            }
        };
        var rook_moveable = (xpos,ypos,camp,movea_space)=>{
            let go = Array(4).fill(true);
            for(let i=1;i<8;i++){ 
                //가로이동
                //i칸 왼쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
                if((xpos-i)>=0 && current.squares[ypos][xpos-i].camp!=camp && go[0]==true){ 
                    console.log('horizonal-');
                    console.log(current.squares[ypos][xpos-i].camp);
                    movea_space.push([ypos,xpos-i]);
                    //i칸 왼쪽의 진영이 상대방일 때 
                    if(current.squares[ypos][xpos-i].camp==rival){
                        go[0]=false;
                    }
                }else{
                    go[0]=false;
                }
                //i칸 오른쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
                if((xpos+i)<=7 && current.squares[ypos][xpos+i].camp!=camp && go[1]==true){
                    console.log('horizonal+');
                    console.log(current.squares[ypos][xpos+i].camp);
                    movea_space.push([ypos,xpos+i]);
                    //i칸 오른쪽의 진영이 상대방일 때
                    if(current.squares[ypos][xpos+i].camp==rival){
                        go[1]=false;
                    }
                }else{
                    go[1]=false;
                }
                //세로이동
                //i칸 위쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
                if((ypos-i)>=0 && current.squares[ypos-i][xpos].camp!=camp && go[2]==true){ 
                    console.log('vertical-');
                    console.log(current.squares[ypos-i][xpos].camp);
                    movea_space.push([ypos-i,xpos]);
                    //i칸 위쪽의 진영이 상대방일 때
                    if(current.squares[ypos-i][xpos].camp==rival){
                        go[2]=false;
                    }
                }else{
                    go[2]=false;
                }
                //i칸 아래쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
                if((ypos+i)<=7 && current.squares[ypos+i][xpos].camp!=camp && go[3]==true){
                    console.log('vertical+');
                    console.log(current.squares[ypos+i][xpos].camp);
                    movea_space.push([ypos+i,xpos]);
                    //i칸 아래쪽의 진영이 상대방일 때
                    if(current.squares[ypos+i][xpos].camp==rival){
                        go[3]=false;
                    }
                }else{
                    go[3]=false;
                }
            }
        };
        var bishop_moveable = (xpos,ypos,camp,movea_space)=>{
            let go = Array(4).fill(true);
            for(let i=1;i<8;i++){
                //좌측상단 이동
                //i칸 위쪽이 존재하고 i칸 좌측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
                if((ypos-i)>=0 && (xpos-i)>=0 && current.squares[ypos-i][xpos-i].camp!=camp && go[0]==true){ 
                    console.log('left-');
                    console.log(current.squares[ypos-i][xpos-i].camp);
                    movea_space.push([ypos-i,xpos-i]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(current.squares[ypos-i][xpos-i].camp==rival){
                        go[0]=false;
                    }
                }else{
                    go[0]=false;
                }
                //우측하단 이동
                //i칸 아래쪽이 존재하고 i칸 우측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
                if((ypos+i)<=7 && (xpos+i)<=7 && current.squares[ypos+i][xpos+i].camp!=camp && go[1]==true){
                    console.log('right+');
                    console.log(current.squares[ypos+i][xpos+i].camp);
                    movea_space.push([ypos+i,xpos+i]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(current.squares[ypos+i][xpos+i].camp==rival){
                        go[1]=false;
                    }
                }else{
                    go[1]=false;
                }
                //우측상단 이동
                //i칸 위쪽이 존재하고 i칸 우측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
                if((ypos-i)>=0 && (xpos+i)<=7 && current.squares[ypos-i][xpos+i].camp!=camp && go[2]==true){ 
                    console.log('right-');
                    console.log(current.squares[ypos-i][xpos+i].camp);
                    movea_space.push([ypos-i,xpos+i]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(current.squares[ypos-i][xpos+i].camp==rival){
                        go[2]=false;
                    }
                }else{
                    go[2]=false;
                }
                //좌측하단 이동
                //i칸 아래쪽이 존재하고 i칸 좌측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
                if((ypos+i)<=7 && (xpos-i)>=0 && current.squares[ypos+i][xpos-i].camp!=camp && go[3]==true){
                    console.log('left+');
                    console.log(current.squares[ypos+i][xpos-i].camp);
                    movea_space.push([ypos+i,xpos-i]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(current.squares[ypos+i][xpos-i].camp==rival){
                        go[3]=false;
                    }
                }else{
                    go[3]=false;
                }
            }
        };
        var knight_moveable = (xpos,ypos,camp,movea_space)=>{
            //좌측 상하
            if(xpos-2>=0){
                if(ypos-1>=0 && current.squares[ypos-1][xpos-2].camp!=camp){
                    movea_space.push([ypos-1,xpos-2]);
                }
                if(ypos+1<=7 && current.squares[ypos+1][xpos-2].camp!=camp){
                    movea_space.push([ypos+1,xpos-2]);
                }
            }
            //우측 상하
            if(xpos+2<=7){
                if(ypos-1>=0 && current.squares[ypos-1][xpos+2].camp!=camp){
                    movea_space.push([ypos-1,xpos+2]);
                }
                if(ypos+1<=7 && current.squares[ypos+1][xpos+2].camp!=camp){
                    movea_space.push([ypos+1,xpos+2]);
                }
            }
            //하단 좌우
            if(ypos+2<=7){
                if(xpos-1>=0 && current.squares[ypos+2][xpos-1].camp!=camp){
                    movea_space.push([ypos+2,xpos-1]);
                }
                if(xpos+1<=7 && current.squares[ypos+2][xpos+1].camp!=camp){
                    movea_space.push([ypos+2,xpos+1]);
                }
            }
            //상단 좌우
            if(ypos-2>=0){
                if(xpos-1>=0 && current.squares[ypos-2][xpos-1].camp!=camp){
                    movea_space.push([ypos-2,xpos-1]);
                }
                if(xpos+1<=7 && current.squares[ypos-2][xpos+1].camp!=camp){
                    movea_space.push([ypos-2,xpos+1]);
                }
            }
        };
        var king_moveable = (xpos,ypos,camp,movea_space)=>{
            if(xpos-1>=0){
                if(current.squares[ypos][xpos-1].camp!=camp){
                    movea_space.push([ypos,xpos-1]);
                }
                if(ypos-1>=0 && current.squares[ypos-1][xpos-1].camp!=camp){
                    movea_space.push([ypos-1,xpos-1]);
                }
                if(ypos+1<=7 && current.squares[ypos+1][xpos-1].camp!=camp){
                    movea_space.push([ypos+1,xpos-1]);
                }
            }
            if(xpos+1<=7){
                if(current.squares[ypos][xpos+1].camp!=camp){
                    movea_space.push([ypos,xpos+1]);
                }
                if(ypos-1>=0 && current.squares[ypos-1][xpos+1].camp!=camp){
                    movea_space.push([ypos-1,xpos+1]);
                }
                if(ypos+1<=7 && current.squares[ypos+1][xpos+1].camp!=camp){
                    movea_space.push([ypos+1,xpos+1]);
                }
            }
            if(ypos+1<=7 && current.squares[ypos+1][xpos].camp!=camp){
                movea_space.push([ypos+1,xpos]);
            }
            if(ypos-1>=0 && current.squares[ypos-1][xpos].camp!=camp){
                movea_space.push([ypos-1,xpos]);
            }
        };
        //html상에 표시된 선택된 칸의 정보 불러오기
        let sval=document.getElementById('sval').innerHTML;
        let spos=document.getElementById('spos').innerHTML;
        let scmp=document.getElementById('scmp').innerHTML;
        let spc=document.getElementById('spc').innerHTML;
        
        //현재 선택한 칸의 정보를 저장, 아래에서 html상에 표시(정보 임시 저장용)
        this.setState({
            selected:p,
            next: this.state.next
        });
        // this.state.selected=p; //원인?
        
        //말 선택
        //말이 있는 칸의, 현재 차례와 맞는 진영의 말 선택 시 진영 정보를 비워 둠
        //이동할 칸 클릭 시 차례와 맞는 진영의 칸이 아니므로 동작하지 않음
        if(p[0]!=''&&p[2]==this.state.next){ 
            // sval=p[0]; //선택한 말의 표시값
            // spos=p[1]; //선택한 말의 좌표
            scmp=''; //말 선택과 동시에 아래의 말 이동이 동작하지 않도록 진영을 비움
            // console.log(sval+","+spos+","+scmp);

            var calc_moveable = (xpos,ypos,piece,camp,movea_space)=>{
                switch(piece){
                    case 'pawn':
                        {
                            pawn_moveable(xpos,ypos,camp,movea_space);
                        }
                        break;
                    case 'rook':
                        {
                            rook_moveable(xpos,ypos,camp,movea_space);
                        }
                        break;
                    case 'bishop':
                        {
                            bishop_moveable(xpos,ypos,camp,movea_space);
                        }
                        break;
                    case 'queen':
                        {
                            rook_moveable(xpos,ypos,camp,movea_space);
                            bishop_moveable(xpos,ypos,camp,movea_space);
                        }
                        break;
                    case 'knight':
                        {
                            knight_moveable(xpos,ypos,camp,movea_space);
                        }
                        break;
                    case 'king':
                        {
                            king_moveable(xpos,ypos,camp,movea_space);
                        }
                        break;
                }
            };
            calc_moveable(p[1][1],p[1][0],p[3],this.state.next,movea);
            if(p[3]=='king')
                {
                    let king_movea = [];
                    console.log(rival);
                    if(movea.length>0){
                        for(let i=0;i<8;i++){
                            for(let j=0;j<8;j++){
                                if(current.squares[i][j].camp==rival){
                                    console.log(current.squares[i][j].camp==rival);
                                    console.log(current.squares[i][j].camp + current.squares[i][j].piece);
                                    calc_moveable(i,j,current.squares[i][j].piece,rival,unmovea);
                                }
                            }
                        }
                    }
                    console.log(unmovea);
                    for(let k=0;k<unmovea.length;k++){
                        king_movea = movea.filter((v)=>{
                            return !(v[0]==unmovea[k][0] && v[1]==unmovea[k][1]);
                        });
                    }
                    console.log(king_movea);
                    movea=king_movea;
                }
            
            this.state.moveable=movea;
            console.log('s:'+this.state.moveable);
            // for(let i=0;i<movea.length;i++){
            //     current.squares[this.state.moveable[i][0]][this.state.moveable[i][1]].moveable=true;
            // }
            // console.log(current.squares[this.state.moveable[0][0]][this.state.moveable[0][1]].moveable);
        //     //옮길 수 있는 칸에 클래스 더해서 해당 클래스를 가진 요소의 배경색 css로 변경
        }

        //말 이동
        //선택된 말이 현재 차레 플레이어와 같은 진영일 때 클릭한 칸으로 이동 가능
        //위의 말 선택 동작으로 인해 선택된 말의 진영이 비워져있으므로 말 선택 시에는 동작하지 않음
        //이동할 칸 클릭시 html상에 출력된 진영 정보를 읽어 와 현재 차례와 비교
        if(this.state.next==scmp){ 
            let able=false;
            console.log('m:'+this.state.moveable);
            po=p[1];
            for(let i=0;i<this.state.moveable.length;i++){
                // console.log(this.state.moveable[i][0]);
                // console.log(po[0]);
                if(this.state.moveable[i][0]==po[0]&&this.state.moveable[i][1]==po[1]){
                    able=true;
                }
            }
            console.log(able);

            if(able){
                console.log(sval+","+spos);
                current.squares[po[0]][po[1]].value=sval; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(표시값)
                current.squares[spos[0]][spos[1]].value=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
                console.log(current.squares[po[0]][po[1]].value);
                
                current.squares[po[0]][po[1]].camp=scmp; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(진영)
                current.squares[spos[0]][spos[1]].camp=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
                console.log(current.squares[po[0]][po[1]].camp);
                
                current.squares[po[0]][po[1]].piece=spc; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(말 종류)
                current.squares[spos[0]][spos[1]].piece=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
                console.log(current.squares[po[0]][po[1]].piece);
                
                //이동 후 선택된 말 정보 초기화, 플레이어 순서 변경
                this.setState({
                    // history: history,
                    selected:[],
                    moveable:[],
                    next: (this.state.next=='white'? 'black':'white')
                });
                // console.log("next:"+this.state.next);
                sval='';
                spos=[];
                scmp='';
                spc='';
            }
        }

    }


    render(){
        const history = this.state.history;
        const current = history[0];

        return(
            <div className="game">
                <div className="game-board">
                    <Board select={(p)=>this.selectedPiece(p)} squares={current.squares}/>
                </div>
                <div id="selected">
                    <p>now: {this.state.next}</p>
                    <ul>
                        <li id="sval">{this.state.selected[0]}</li>
                        <li id="spos">{this.state.selected[1]}</li>
                        <li id="scmp">{this.state.selected[2]}</li>
                        <li id="spc">{this.state.selected[3]}</li>
                        <li>{this.state.moveable}</li>
                    </ul>
                </div>
            </div>
        );
    }
}