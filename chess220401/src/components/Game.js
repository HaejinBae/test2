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
                            {camp:'black', value:'♟'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♙'}
                        );
                    }
                }else if((i==0||i==7)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♜'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♖'}
                        );
                    }
                }
                else if((i==1||i==6)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♞'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♘'}
                        );
                    }
                }
                else if((i==2||i==5)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♝'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♗'}
                        );
                    }
                }
                else if((j==0||j==7)&&i==3){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♛'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♕'}
                        );
                    }
                }
                else if((j==0||j==7)&&i==4){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♚'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♔'}
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
            next: 'white'
        };
        console.log(this.state.history);
    }

    selectedPiece(p){
        //현재 선택한 칸의 좌표를 저장할 변수
        let po=[];
        //html상에 표시된 선택된 칸의 정보 불러오기
        let sval=document.getElementById('sval').innerHTML;
        let spos=document.getElementById('spos').innerHTML;
        let scmp=document.getElementById('scmp').innerHTML;
        
        //현재 선택한 칸의 정보를 저장, 아래에서 html상에 표시(정보 임시 저장용)
        this.setState({
            history: this.state.history,
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
            scmp=''; //말 선택과 동시에 아래가 동작하지 않도록 진영을 비움
            // console.log(sval+","+spos+","+scmp);
        }
        //말 이동
        //선택된 말이 현재 차레 플레이어와 같은 진영일 때 클릭한 칸으로 이동 가능
        //위의 동작으로 인해 선택된 말의 진영이 비워져있으므로 말 선택 시에는 동작하지 않음
        //이동할 칸 클릭시 html상에 출력된 진영 정보를 읽어 와 현재 차례와 비교
        if(this.state.next==scmp){ 
            po=p[1];

            console.log(sval+","+spos);
            this.state.history[0].squares[po[0]][po[1]].value=sval; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(표시값)
            this.state.history[0].squares[spos[0]][spos[1]].value=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
            console.log(this.state.history[0].squares[po[0]][po[1]].value);
            
            this.state.history[0].squares[po[0]][po[1]].camp=scmp; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(진영)
            this.state.history[0].squares[spos[0]][spos[1]].camp=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
            console.log(this.state.history[0].squares[po[0]][po[1]].camp);
            
            //이동 후 선택된 말 정보 초기화, 플레이어 순서 변경
            this.setState({
                history: this.state.history,
                selected:[],
                next: (this.state.next=='white'? 'black':'white')
            });
            // console.log("next:"+this.state.next);
            sval='';
            spos=[];
            scmp='';
        }else{
            return;
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
                    </ul>
                </div>
            </div>
        );
    }
}