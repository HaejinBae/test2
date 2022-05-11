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
        
        let s='';
        let po=[];
        let cmp='';
        let sval=document.getElementById('sval').innerHTML;
        let spos=document.getElementById('spos').innerHTML;
        let scmp=document.getElementById('scmp').innerHTML;
        let mov;
        
        this.setState({
            history: this.state.history,
            selected:p,
            next: this.state.next
        });
        // this.state.selected=p; //원인?
        
        po=p[1];
        if(p[0]!=''&&p[2]==this.state.next){ 
            s=p[0];
            sval=s;
            spos=po;
            scmp=cmp;
        }
        if(this.state.next==scmp&&sval!=''){ //현재 차레 플레이어와 같은 진영의 말 선택 시, 말이 있는(value가 존재하는) 칸만 이동 가능
            console.log(sval+","+spos);
            this.state.history[0].squares[po[0]][po[1]].value=sval;
            this.state.history[0].squares[spos[0]][spos[1]].value=s;
            console.log(this.state.history[0].squares[po[0]][po[1]].value);
            
            this.state.history[0].squares[po[0]][po[1]].camp=scmp;
            this.state.history[0].squares[spos[0]][spos[1]].camp=cmp;
            console.log(this.state.history[0].squares[po[0]][po[1]].camp);
            

            this.setState({
                history: this.state.history,
                selected:[],
                next: (this.state.next=='white'? 'black':'white')
            });
            console.log("next:"+this.state.next);
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