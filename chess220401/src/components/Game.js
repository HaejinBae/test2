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
        //현재 선택한 칸의 좌표를 저장할 변수
        let po=[];
        //이동 가능한 칸의 좌표를 저장할 배열
        let movea=[];
        //선택한 말의 이동가능한 칸을 계산하는 함수
        var rook_movable = ()=>{
            let go = Array(4).fill(true);
            for(let i=1;i<8;i++){ 
                //가로이동
                if((p[1][1]-i)>=0 && current.squares[p[1][0]][p[1][1]-i].camp!=this.state.next && go[0]==true){ 
                    console.log('horizonal-');
                    console.log(current.squares[p[1][0]][p[1][1]-i].camp);
                    movea.push([p[1][0],p[1][1]-i]);
                }else{
                    go[0]=false;
                }
                if((p[1][1]+i)<=7 && current.squares[p[1][0]][p[1][1]+i].camp!=this.state.next && go[1]==true){
                    console.log('horizonal+');
                    console.log(current.squares[p[1][0]][p[1][1]+i].camp);
                    movea.push([p[1][0],p[1][1]+i]);
                }else{
                    go[1]=false;
                }
                //세로이동
                if((p[1][0]-i)>=0 && current.squares[p[1][0]-i][p[1][1]].camp!=this.state.next && go[2]==true){ 
                    console.log('vertical-');
                    console.log(current.squares[p[1][0]-i][p[1][1]].camp);
                    movea.push([p[1][0]-i,p[1][1]]);
                }else{
                    go[2]=false;
                }
                if((p[1][0]+i)<=7 && current.squares[p[1][0]+i][p[1][1]].camp!=this.state.next && go[3]==true){
                    console.log('vertical+');
                    console.log(current.squares[p[1][0]+i][p[1][1]].camp);
                    movea.push([p[1][0]+i,p[1][1]]);
                }else{
                    go[3]=false;
                }
            }
        };
        var bishop_moveable = ()=>{
            let go = Array(4).fill(true);
            for(let i=1;i<8;i++){
                if( (p[1][0]-i)>=0 && (p[1][1]-i)>=0 && current.squares[p[1][0]-i][p[1][1]-i].camp!=this.state.next && go[0]==true){ 
                    console.log('left-');
                    console.log(current.squares[p[1][0]-i][p[1][1]-i].camp);
                    movea.push([p[1][0]-i,p[1][1]-i]);
                }else{
                    go[0]=false;
                }
                if((p[1][0]+i)<=7 && (p[1][1]+i)<=7 && current.squares[p[1][0]+i][p[1][1]+i].camp!=this.state.next && go[1]==true){
                    console.log('right+');
                    console.log(current.squares[p[1][0]+i][p[1][1]+i].camp);
                    movea.push([p[1][0]+i,p[1][1]+i]);
                }else{
                    go[1]=false;
                }
                if((p[1][0]-i)>=0 && (p[1][1]+i)<=7 && current.squares[p[1][0]-i][p[1][1]+i].camp!=this.state.next && go[2]==true){ 
                    console.log('left+');
                    console.log(current.squares[p[1][0]-i][p[1][1]+i].camp);
                    movea.push([p[1][0]-i,p[1][1]+i]);
                }else{
                    go[2]=false;
                }
                if((p[1][0]+i)<=7 && (p[1][1]-i)>=0 && current.squares[p[1][0]+i][p[1][1]-i].camp!=this.state.next && go[3]==true){
                    console.log('right-');
                    console.log(current.squares[p[1][0]+i][p[1][1]-i].camp);
                    movea.push([p[1][0]+i,p[1][1]-i]);
                }else{
                    go[3]=false;
                }
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

            switch(p[3]){
                case 'pawn':
                    {
                        if(p[2]=='white'){
                            if((p[1][0]-1)>=0 && current.squares[p[1][0]-1][p[1][1]].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                                movea.push([p[1][0]-1,p[1][1]]);
                            }
                            // console.log(p[1]);
                            if(p[1][0]==6 && current.squares[p[1][0]-1][p[1][1]].value=='' 
                                && current.squares[p[1][0]-2][p[1][1]].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                                    movea.push([p[1][0]-2,p[1][1]]);
                            }
                            // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
                            if((p[1][0]-1)>=0) { //폰의 한 칸 앞이 존재하고
                                console.log('pawn catch');
                                //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                                if(((p[1][1]-1)>=0) && current.squares[p[1][0]-1][p[1][1]-1].camp=='black'){ 
                                    console.log('front left');
                                    movea.push([p[1][0]-1,p[1][1]-1]);
                                }
                                //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                                if(((p[1][1]+1)<=7) && current.squares[p[1][0]-1][p[1][1]+1].camp=='black'){ 
                                    console.log('front right');
                                    movea.push([p[1][0]-1,p[1][1]+1]);
                                }
                            }
                        }else if(p[2]=='black'){
                            if((p[1][0]+1)<=7 && current.squares[p[1][0]+1][p[1][1]].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                                movea.push([p[1][0]+1,p[1][1]]);
                            }
                            // console.log(p[1]);
                            if(p[1][0]==1 && current.squares[p[1][0]+1][p[1][1]].value=='' 
                                && current.squares[p[1][0]+2][p[1][1]].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                                    movea.push([p[1][0]+2,p[1][1]]);
                            }
                            // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
                            if((p[1][0]+1)>=0) { //폰의 한 칸 앞이 존재하고
                                console.log('pawn catch');
                                //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                                if(((p[1][1]-1)>=0) && current.squares[p[1][0]+1][p[1][1]-1].camp=='white'){ 
                                    console.log('front left');
                                    movea.push([p[1][0]+1,p[1][1]-1]);
                                }
                                //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                                if(((p[1][1]+1)<=7) && current.squares[p[1][0]+1][p[1][1]+1].camp=='white'){ 
                                    console.log('front right');
                                    movea.push([p[1][0]+1,p[1][1]+1]);
                                }
                            }
                        }
                    }
                    break;
                case 'rook':
                    {
                        rook_movable();
                    }
                    break;
                case 'bishop':
                    {
                        bishop_moveable();
                    }
                    break;
                case 'queen':
                    {
                        rook_movable();
                        bishop_moveable();
                    }
                    break;
                // case 'knight':
                //     {

                //     }
                //     break;
                // case 'king':
                //     {}
                //     break;
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