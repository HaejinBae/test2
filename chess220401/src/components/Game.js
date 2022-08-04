import React from "react";
import Board from "./Board";
import Pieces from "./Pieces";

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
                        {camp:'', value:'', piece:''}
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
            next: 'white',
            black_king_pos: [0,4],
            white_king_pos: [7,4],
            check_path: null,
            promotion: null
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
        
        for(let i=0;i<64;i++){
            document.getElementsByClassName("square-container")[i].classList.remove('selected');
        }
        //말 선택
        //말이 있는 칸의, 현재 차례와 맞는 진영의 말 선택 시 진영 정보를 비워 둠
        //이동할 칸 클릭 시 차례와 맞는 진영의 칸이 아니므로 동작하지 않음
        if(p[0]!=''&&p[2]==this.state.next){ 
            //배경색 css 원래대로
            if(this.state.moveable.length>0){
                for(let i=0;i<this.state.moveable.length;i++){
                    document.getElementsByClassName("board-row")[this.state.moveable[i][0]].children[this.state.moveable[i][1]].classList.remove('moveable');
                }
            }
            // sval=p[0]; //선택한 말의 표시값
            // spos=p[1]; //선택한 말의 좌표
            scmp=''; //말 선택과 동시에 아래의 말 이동이 동작하지 않도록 진영을 비움
            // console.log(sval+","+spos+","+scmp);

            


            this.calc_moveable(p[1][1],p[1][0],p[3],this.state.next,movea);
            //킹끼리 만날 수 없으므로 단순계산으로 충분
            if(p[3]=='king'){
                // this.calc_king_check_moveable(this.state.next,movea,unmovea);
                // console.log('movea'+movea);
                //필터는 동작하는데 나오면 부활 문제

                let next_rival = (this.state.next=='white'? 'black':'white');
                console.log("next_rival:"+next_rival);
                if(movea.length>0){
                    for(let i=0;i<8;i++){
                        for(let j=0;j<8;j++){
                            if(current.squares[i][j].camp==next_rival){
                                console.log(current.squares[i][j].camp==next_rival);
                                console.log(current.squares[i][j].camp + current.squares[i][j].piece);
                                this.calc_moveable(j,i,current.squares[i][j].piece,next_rival,unmovea);
                            }
                        }
                    }
                }
                unmovea = new Set(unmovea);
                console.log(unmovea);

                for(let item of unmovea.keys()){
                    movea = movea.filter(v=>{
                        return !(v[0]==item[0] && v[1]==item[1]);
                    });
                }
                console.log(movea);
            }
            console.log('movea'+movea);
            
            //체크 상황에 움직일 수 있는 경로
            if(this.state.check_path!=null){
                console.log('c:'+this.state.check_path);
                console.log('d:'+movea);
                if(p[3]!='king'){
                    let a_check_movea = [];
                    for(let j=0;j<this.state.check_path.length;j++){
                        console.log(this.state.check_path[j][0]+','+this.state.check_path[j][1]);
                        for(let i=0;i<movea.length;i++){
                            if(movea[i][0]==this.state.check_path[j][0] && movea[i][1]==this.state.check_path[j][1]){
                                a_check_movea.push(this.state.check_path[j]);
                            }
                        }
                    }
                    movea = a_check_movea;
                }
            }

            this.state.moveable=movea;
            console.log('s:'+this.state.moveable);
            
            document.getElementsByClassName("board-row")[p[1][0]].children[p[1][1]].classList.add('selected');
            //옮길 수 있는 칸에 클래스 더해서 해당 클래스를 가진 요소의 배경색 css로 변경
            for(let i=0;i<this.state.moveable.length;i++){
                console.log(document.getElementsByClassName("board-row")[this.state.moveable[i][0]].children[this.state.moveable[i][1]].classList);
                document.getElementsByClassName("board-row")[this.state.moveable[i][0]].children[this.state.moveable[i][1]].classList.add('moveable');
            }
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
                    break;
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

                
                if(spc=='king'){
                    if(scmp=='white'){
                        this.state.white_king_pos = po;
                    }else if(scmp=='black'){
                        this.state.black_king_pos = po;
                    }
                    this.state.check_path = null;
                }else{
                    //프로모션
                    if(spc=='pawn'){
                        if(scmp=='white'){
                            if(po[0]==0){
                                this.state.promotion = po;
                                console.log('pro:'+this.state.promotion);
                                for(let i=0;i<64;i++){
                                    document.getElementsByClassName("square")[i].disabled = true;
                                }
                                document.getElementsByClassName("container")[0].classList.add("white");
                                document.getElementsByClassName("container")[0].classList.remove("black");
                            }
                        }else if(scmp=='black'){
                            if(po[0]==7){
                                this.state.promotion = po;
                                console.log('pro:'+this.state.promotion);
                                for(let i=0;i<64;i++){
                                    document.getElementsByClassName("square")[i].disabled = true;
                                }
                                document.getElementsByClassName("container")[0].classList.add("black");
                                document.getElementsByClassName("container")[0].classList.remove("white");
                            }
                        }
                    }
                    //체크 판단
                    this.check(po[1],po[0],scmp,spc);
                }

                if(this.state.promotion==null){
                    //이동 후 선택된 말 정보 초기화, 플레이어 순서 변경
                    this.setState({
                        // history: history,
                        selected:[],
                        moveable:[],
                        next: (this.state.next=='white'? 'black':'white')
                    });
                }
                // console.log("next:"+this.state.next);
                sval='';
                spos=[];
                scmp='';
                spc='';
            }

            

            //배경색 css 원래대로
            for(let i=0;i<this.state.moveable.length;i++){
                document.getElementsByClassName("board-row")[this.state.moveable[i][0]].children[this.state.moveable[i][1]].classList.remove('moveable');
            }
        }

    }

    //선택한 말의 이동가능한 칸을 계산하는 함수
    //선택된 칸의 좌표만 받는것 문제
    pawn_moveable(xpos,ypos,camp,movea_space){
        const history=this.state.history;
        const current=history[0];
        if(camp=='white'){
            if((ypos-1)>=0 && current.squares[ypos-1][xpos].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                console.log((ypos-1)+","+xpos);
                movea_space.push([(ypos-1),xpos]);
            }
            // console.log(p[1]);
            if(ypos==6 && current.squares[ypos-1][xpos].value=='' 
                && current.squares[ypos-2][xpos].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                    console.log((ypos-2)+","+xpos);
                    movea_space.push([(ypos-2),xpos]);
            }
            // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
            if((ypos-1)>=0) { //폰의 한 칸 앞이 존재하고
                // console.log('pawn catch');
                //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos-1)>=0) && current.squares[ypos-1][xpos-1].camp=='black'){ 
                    console.log('front left');
                    console.log((ypos-1)+","+(xpos-1));
                    movea_space.push([(ypos-1),(xpos-1)]);
                }
                //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos+1)<=7) && current.squares[ypos-1][xpos+1].camp=='black'){ 
                    console.log('front right');
                    console.log((ypos-1)+","+(xpos+1));
                    movea_space.push([(ypos-1),(xpos+1)]);
                }
            }
        }else if(camp=='black'){
            if((ypos+1)<=7 && current.squares[ypos+1][xpos].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                console.log((ypos+1)+","+xpos);
                movea_space.push([(ypos+1),xpos]);
            }
            // console.log(p[1]);
            if(ypos==1 && current.squares[ypos+1][xpos].value=='' 
                && current.squares[ypos+2][xpos].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                    console.log((ypos+2)+","+xpos);
                    movea_space.push([(ypos+2),xpos]);
            }
            // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
            if((ypos+1)<=7) { //폰의 한 칸 앞이 존재하고
                // console.log('pawn catch');
                //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos-1)>=0) && current.squares[ypos+1][xpos-1].camp=='white'){ 
                    console.log('front left');
                    console.log((ypos+1)+","+(xpos-1));
                    movea_space.push([(ypos+1),(xpos-1)]);
                }
                //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos+1)<=7) && current.squares[ypos+1][xpos+1].camp=='white'){ 
                    console.log('front right');
                    console.log((ypos+1)+","+(xpos+1));
                    movea_space.push([(ypos+1),(xpos+1)]);
                }
            }
        }
    }
    rook_moveable(xpos,ypos,camp,movea_space){
        const history=this.state.history;
        const current=history[0];
        let rival = (this.state.next=='white'? 'black':'white');
        let go = Array(4).fill(true);
        for(let i=1;i<8;i++){ 
            //가로이동
            //i칸 왼쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
            if((xpos-i)>=0 && current.squares[ypos][xpos-i].camp!=camp && go[0]==true){ 
                console.log('horizonal-');
                console.log(current.squares[ypos][xpos-i].camp);
                movea_space.push([ypos,(xpos-i)]);
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
                movea_space.push([ypos,(xpos+i)]);
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
                movea_space.push([(ypos-i),xpos]);
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
                movea_space.push([(ypos+i),xpos]);
                //i칸 아래쪽의 진영이 상대방일 때
                if(current.squares[ypos+i][xpos].camp==rival){
                    go[3]=false;
                }
            }else{
                go[3]=false;
            }
        }
    }
    bishop_moveable(xpos,ypos,camp,movea_space){
        const history=this.state.history;
        const current=history[0];
        let rival = (this.state.next=='white'? 'black':'white');
        let go = Array(4).fill(true);
        for(let i=1;i<8;i++){
            //좌측상단 이동
            //i칸 위쪽이 존재하고 i칸 좌측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
            if((ypos-i)>=0 && (xpos-i)>=0 && current.squares[ypos-i][xpos-i].camp!=camp && go[0]==true){ 
                console.log('left-');
                console.log(current.squares[ypos-i][xpos-i].camp);
                movea_space.push([(ypos-i),(xpos-i)]);
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
                movea_space.push([(ypos+i),(xpos+i)]);
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
                movea_space.push([(ypos-i),(xpos+i)]);
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
                movea_space.push([(ypos+i),(xpos-i)]);
                //해당 칸의 진영이 상대 진영일 때
                if(current.squares[ypos+i][xpos-i].camp==rival){
                    go[3]=false;
                }
            }else{
                go[3]=false;
            }
        }
    }
    knight_moveable(xpos,ypos,camp,movea_space){
        const history=this.state.history;
        const current=history[0];
        console.log(ypos+","+xpos);
        //좌측 상하
        if(xpos-2>=0){
            if(ypos-1>=0 && current.squares[ypos-1][xpos-2].camp!=camp){
                console.log((ypos-1)+","+(xpos-2));
                movea_space.push([(ypos-1),(xpos-2)]);
            }
            if(ypos+1<=7 && current.squares[ypos+1][xpos-2].camp!=camp){
                console.log((ypos+1)+","+(xpos-2));
                movea_space.push([(ypos+1),(xpos-2)]);
            }
        }
        //우측 상하
        if(xpos+2<=7){
            if(ypos-1>=0 && current.squares[ypos-1][xpos+2].camp!=camp){
                console.log((ypos-1)+","+(xpos+2));
                movea_space.push([(ypos-1),(xpos+2)]);
            }
            if(ypos+1<=7 && current.squares[ypos+1][xpos+2].camp!=camp){
                console.log((ypos+1)+","+(xpos+2));
                movea_space.push([(ypos+1),(xpos+2)]);
            }
        }
        //하단 좌우
        if(ypos+2<=7){
            if(xpos-1>=0 && current.squares[ypos+2][xpos-1].camp!=camp){
                console.log((ypos+2)+","+(xpos-1));
                movea_space.push([(ypos+2),(xpos-1)]);
            }
            if(xpos+1<=7 && current.squares[ypos+2][xpos+1].camp!=camp){
                console.log((ypos+2)+","+(xpos+1));
                movea_space.push([(ypos+2),(xpos+1)]);
            }
        }
        //상단 좌우
        if(ypos-2>=0){
            if(xpos-1>=0 && current.squares[ypos-2][xpos-1].camp!=camp){
                console.log((ypos-2)+","+(xpos-1));
                movea_space.push([(ypos-2),(xpos-1)]);
            }
            if(xpos+1<=7 && current.squares[ypos-2][xpos+1].camp!=camp){
                console.log((ypos-2)+","+(xpos+1));
                movea_space.push([(ypos-2),(xpos+1)]);
            }
        }
    }
    king_moveable(xpos,ypos,camp,movea_space){
        const history=this.state.history;
        const current=history[0];
        if(xpos-1>=0){
            if(current.squares[ypos][xpos-1].camp!=camp){
                movea_space.push([ypos,(xpos-1)]);
            }
            if(ypos-1>=0 && current.squares[ypos-1][xpos-1].camp!=camp){
                movea_space.push([(ypos-1),(xpos-1)]);
            }
            if(ypos+1<=7 && current.squares[ypos+1][xpos-1].camp!=camp){
                movea_space.push([(ypos+1),(xpos-1)]);
            }
        }
        if(xpos+1<=7){
            if(current.squares[ypos][xpos+1].camp!=camp){
                movea_space.push([ypos,(xpos+1)]);
            }
            if(ypos-1>=0 && current.squares[ypos-1][xpos+1].camp!=camp){
                movea_space.push([(ypos-1),(xpos+1)]);
            }
            if(ypos+1<=7 && current.squares[ypos+1][xpos+1].camp!=camp){
                movea_space.push([(ypos+1),(xpos+1)]);
            }
        }
        if(ypos+1<=7 && current.squares[ypos+1][xpos].camp!=camp){
            movea_space.push([(ypos+1),xpos]);
        }
        if(ypos-1>=0 && current.squares[ypos-1][xpos].camp!=camp){
            movea_space.push([(ypos-1),xpos]);
        }
    }
    // calc_king_check_moveable(camp,movea_space,unmovea_space){
    //     const history=this.state.history;
    //     const current=history[0];
    //     console.log(camp);
    //     let next_rival = (camp=='white'? 'black':'white');
    //     console.log("next_rival:"+next_rival);
    //     if(movea_space.length>0){
    //         for(let i=0;i<8;i++){
    //             for(let j=0;j<8;j++){
    //                 if(current.squares[i][j].camp==next_rival){
    //                     console.log(current.squares[i][j].camp==next_rival);
    //                     console.log(current.squares[i][j].camp + current.squares[i][j].piece);
    //                     this.calc_moveable(j,i,current.squares[i][j].piece,next_rival,unmovea_space);
    //                 }
    //             }
    //         }
    //     }
    //     unmovea_space = new Set(unmovea_space);
    //     console.log(unmovea_space);

    //     for(let item of unmovea_space.keys()){
    //         movea_space = movea_space.filter(v=>{
    //             return !(v[0]==item[0] && v[1]==item[1]);
    //         });
    //     }
    //     console.log(movea_space);
    // }

    calc_moveable(xpos,ypos,piece,camp,movea_space){
        // let rival = (camp=='white'? 'black':'white');

        // console.log("camp:"+camp);
        // console.log("rival:"+rival);
        switch(piece){
            case 'pawn':
                {
                    this.pawn_moveable(xpos,ypos,camp,movea_space);
                }
                break;
            case 'rook':
                {
                    this.rook_moveable(xpos,ypos,camp,movea_space);
                }
                break;
            case 'bishop':
                {
                    this.bishop_moveable(xpos,ypos,camp,movea_space);
                }
                break;
            case 'queen':
                {
                    this.rook_moveable(xpos,ypos,camp,movea_space);
                    this.bishop_moveable(xpos,ypos,camp,movea_space);
                }
                break;
            case 'knight':
                {
                    this.knight_moveable(xpos,ypos,camp,movea_space);
                }
                break;
            case 'king':
                {
                    this.king_moveable(xpos,ypos,camp,movea_space);
                }
                break;
        }
    }



    check(xpos,ypos,camp,piece){
        this.state.check_path = null;
        let rival = (this.state.next=='white'? 'black':'white');
        //움직인 말의 다음 경로를 저장하여 킹이 해당 경로에 포함되는지 확인하기 위한 배열 
        let chk_check = [];
        let rival_king_pos = (camp=='white'? this.state.black_king_pos:this.state.white_king_pos);
        console.log(rival_king_pos);
        this.calc_moveable(xpos,ypos,piece,camp,chk_check);
        for(let i=0;i<chk_check.length;i++){
            console.log(chk_check[i]);
            if(chk_check[i][0]==rival_king_pos[0] && chk_check[i][1]==rival_king_pos[1]){
                console.log('!!!!!!!!!!!check!!!!!!!!!!!!');
                //체크중인 말을 막기 위한 경로를 저장하기 위한 배열
                let check_movea = chk_check;
                check_movea = check_movea.filter(v=>{
                    if(ypos<=rival_king_pos[0]){
                        if(xpos<=rival_king_pos[1]){
                            return (
                                (v[0]<=rival_king_pos[0] && ypos<=v[0]) 
                                && (v[1]<=rival_king_pos[1] && xpos<=v[1]) 
                                && !((v[0]==rival_king_pos[0]) && (v[1]==rival_king_pos[1]))
                            );
                        }else{
                            return (
                                (v[0]<=rival_king_pos[0] && ypos<=v[0]) 
                                && (v[1]>=rival_king_pos[1] && xpos>=v[1])
                                && !((v[0]==rival_king_pos[0]) && (v[1]==rival_king_pos[1]))
                            );
                        }
                    }else{
                        if(xpos<=rival_king_pos[1]){
                            return (
                                (v[0]>=rival_king_pos[0] && ypos>=v[0]) 
                                && (v[1]<=rival_king_pos[1] && xpos<=v[1])
                                && !((v[0]==rival_king_pos[0]) && (v[1]==rival_king_pos[1]))
                            );
                        }else{
                            return (
                                (v[0]>=rival_king_pos[0] && ypos>=v[0]) 
                                && (v[1]>=rival_king_pos[1] && xpos>=v[1])
                                && !((v[0]==rival_king_pos[0]) && (v[1]==rival_king_pos[1]))
                            );
                        }
                    }
                });
                check_movea.push([ypos,xpos]);
                console.log('a:'+check_movea);
                this.state.check_path = check_movea;
                
                break;
            }
        }
        console.log('checked?'+this.state.check_path);

        //체크메이트
        // let rival_king_movea = [];
        // let rival_king_unmovea = [];
        // this.king_moveable(rival_king_pos[1],rival_king_pos[0],this.state.next,rival_king_movea);
        // this.calc_king_check_moveable(this.state.next,rival_king_movea,rival_king_unmovea);
        
    }

    promotion(val,pc){
        const history = this.state.history;
        const current = history[0];

        console.log(val+','+pc+','+this.state.promotion);
        current.squares[this.state.promotion[0]][this.state.promotion[1]].value = val;
        current.squares[this.state.promotion[0]][this.state.promotion[1]].piece = pc;

        this.check(this.state.promotion[1],this.state.promotion[0],this.state.next,pc);

        this.setState({
            // history: history,
            selected:[],
            moveable:[],
            next: (this.state.next=='white'? 'black':'white'),
            promotion: null
        });

        for(let i=0;i<64;i++){
            document.getElementsByClassName("square")[i].disabled = false;
        }
    }


    render(){
        const history = this.state.history;
        const current = history[0];

        return(
            <div className="game">
                <div className="container">
                    <div className="game-board">
                        <Board select={(p)=>this.selectedPiece(p)} squares={current.squares}/>
                    </div>
                    <Pieces next={this.state.next} pro={this.state.promotion} promotion={(val,pc)=>this.promotion(val,pc)}/>
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