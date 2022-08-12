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
            history: [{
                squares: row,
                black_king_pos: [0,4],
                white_king_pos: [7,4],
                check_path: [],
                game: 'continue',
                white_pieces: {
                    king:  1,
                    queen:  1,
                    bishop:  2,
                    knight:  2,
                    rook:  2,
                    pawn:  8
                },
                black_pieces: {
                    king:  1,
                    queen:  1,
                    bishop:  2,
                    knight:  2,
                    rook:  2,
                    pawn:  8
                }
            }],
            stepNumber: 0,
            selected:[],
            moveable:[],
            next: 'white',
            promotion: null
        };
        console.log(this.state.history);
    }

    selectedPiece(p){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = [];
        for(let i=0;i<8;i++){
            let square_rows = [];
            for(let j=0;j<8;j++){
                square_rows.push({
                    value: current.squares[i][j].value,
                    camp: current.squares[i][j].camp,
                    piece: current.squares[i][j].piece
                });
            }
            squares.push(square_rows);
        }
        let w_king_pos = current.white_king_pos.slice();
        let b_king_pos = current.black_king_pos.slice();
        let chk_path = current.check_path.slice();
        let game = current.game.slice();
        const white_pieces = current.white_pieces;
        const w_pieces = {
            king:  white_pieces.king,
            queen:  white_pieces.queen,
            bishop:  white_pieces.bishop,
            knight:  white_pieces.knight,
            rook:  white_pieces.rook,
            pawn:  white_pieces.pawn
        };
        const black_pieces = current.black_pieces;
        const b_pieces = {
            king:  black_pieces.king,
            queen:  black_pieces.queen,
            bishop:  black_pieces.bishop,
            knight:  black_pieces.knight,
            rook:  black_pieces.rook,
            pawn:  black_pieces.pawn
        };
        console.log(black_pieces);
        let rival = (this.state.next=='white'? 'black':'white');
        let next_king_pos = (this.state.next=='black'? b_king_pos:w_king_pos);
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

            


            this.calc_moveable(squares,w_king_pos,b_king_pos,p[1][1],p[1][0],p[3],this.state.next,movea);
            //킹끼리 만날 수 없으므로 단순계산으로 충분
            // this.calc_all_moveable(this.state.next,unmovea);
            // console.log('movea'+movea);
            //필터는 동작하는데 나오면 부활 문제
            
            // let next_rival = (this.state.next=='white'? 'black':'white');
            // console.log("next_rival:"+next_rival);
            if(movea.length>0){
                if(p[3]=='king'){
                    this.calc_all_moveable(squares,w_king_pos,b_king_pos,rival,unmovea);
                    
                    unmovea = new Set(unmovea);
                    console.log(unmovea);

                    for(let item of unmovea.keys()){
                        movea = movea.filter(v=>{
                            return !(v[0]==item[0] && v[1]==item[1]);
                        });
                        console.log(movea);
                    }
                }else{
                    this.calc_all_moveable(squares,w_king_pos,b_king_pos,rival,unmovea,false);
                    
                    unmovea = new Set(unmovea);
                    console.log(unmovea);

                    let unchk_king_flag = false;
                    for(let item of unmovea.keys()){
                        if(next_king_pos[0]==item[0] && next_king_pos[1]==item[1]){
                            unchk_king_flag = true;
                            break;
                        }
                    }
                    if(unchk_king_flag){
                        let unchk_flag = false;
                        for(let item of unmovea.keys()){
                            if(p[1][0]==item[0] && p[1][1]==item[1]){
                                console.log('uncheck?'+p[1]);
                                unchk_flag = true;
                                break;
                            }
                        }
                        if(unchk_flag){
                            if(p[3]=='knight'){
                                movea = [];
                            }else{
                                let unchk_movea = [];
                                for(let item of unmovea.keys()){
                                    // document.getElementsByClassName("board-row")[item[0]].children[item[1]].classList.add('unmoveable');
                                    for(let i=0;i<movea.length;i++){
                                        console.log(i+item+':'+movea[i]);
                                        if(item[0]==movea[i][0] && item[1]==movea[i][1]){
                                            console.log('zzzzzzzzzzzzzzzzz');
                                            console.log(item);
                                            unchk_movea.push(item);
                                        }
                                    }
                                }
                                movea = unchk_movea;
                            }
                        }
                    }
                }
            }
            console.log('movea'+movea);
            
            //체크 상황에 움직일 수 있는 경로
            if(chk_path.length>0){
                console.log('c:'+chk_path);
                console.log('d:'+movea);
                if(p[3]!='king'){
                    let a_check_movea = [];
                    for(let j=0;j<chk_path.length;j++){
                        console.log(chk_path[j][0]+','+chk_path[j][1]);
                        for(let i=0;i<movea.length;i++){
                            if(movea[i][0]==chk_path[j][0] && movea[i][1]==chk_path[j][1]){
                                a_check_movea.push(chk_path[j]);
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
                //상대 말을 잡으면 말 개수 줄이기(무승부 판정 위함)
                if(squares[po[0]][po[1]].camp==rival){
                    let rival_pieces = (this.state.next=='white'?b_pieces:w_pieces);
                    let catch_piece = squares[po[0]][po[1]].piece;
                    if(this.state.next=='white'){
                        b_pieces[catch_piece] = rival_pieces[catch_piece]-1;
                        console.log('black pieces?'+catch_piece+b_pieces[catch_piece]);
                    }else if(this.state.next=='black'){
                        w_pieces[catch_piece] = rival_pieces[catch_piece]-1;
                        console.log('white pieces?'+catch_piece+w_pieces[catch_piece]);
                    }
                }

                console.log(sval+","+spos);
                squares[po[0]][po[1]].value=sval; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(표시값)
                squares[spos[0]][spos[1]].value=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
                console.log(squares[po[0]][po[1]].value);
                
                squares[po[0]][po[1]].camp=scmp; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(진영)
                squares[spos[0]][spos[1]].camp=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
                console.log(squares[po[0]][po[1]].camp);
                
                squares[po[0]][po[1]].piece=spc; //현재 클릭한 칸을 html상에 출력된 선택된 말 정보로 변경(말 종류)
                squares[spos[0]][spos[1]].piece=''; //html상에 출력된 선택된 말의 원래 좌표의 칸을 비우기
                console.log(squares[po[0]][po[1]].piece);

                
                if(spc=='king'){
                    if(scmp=='white'){
                        w_king_pos = po;
                    }else if(scmp=='black'){
                        b_king_pos = po;
                    }
                    chk_path = [];
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
                }
                
                
                if(this.state.promotion==null){
                    game = this.draw(w_pieces,b_pieces);
                    //승부 판정
                    console.log('55555555555555555555555555555555555555555555');
                    console.log(game);
                    if(game!='draw'){
                        if(spc!='king'){
                            //체크 판단
                            chk_path = this.check(squares,w_king_pos,b_king_pos,po[1],po[0],scmp,spc);
                        }
                        if(chk_path.length==0){
                            chk_path = this.calc_all_moveable(squares,w_king_pos,b_king_pos,this.state.next,[],true);
                        }
                        game = this.checkmate(squares,w_king_pos,b_king_pos,chk_path);
                    }
                    //이동 후 선택된 말 정보 초기화, 플레이어 순서 변경
                    this.setState({
                        // history: history,
                        history: history.concat([{
                            squares: squares,
                            black_king_pos: b_king_pos,
                            white_king_pos: w_king_pos,
                            check_path: chk_path,
                            game: game,
                            white_pieces: w_pieces,
                            black_pieces: b_pieces
                        }]), //배열에 추가
                        stepNumber: history.length,
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
            console.log(game);
        }

    }

    //선택한 말의 이동가능한 칸을 계산하는 함수
    //선택된 칸의 좌표만 받는것 문제
    pawn_moveable(sqrs,xpos,ypos,camp,movea_space){
        const squares = sqrs;
        if(camp=='white'){
            if((ypos-1)>=0 && squares[ypos-1][xpos].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                console.log((ypos-1)+","+xpos);
                movea_space.push([(ypos-1),xpos]);
            }
            // console.log(p[1]);
            if(ypos==6 && squares[ypos-1][xpos].value=='' 
                && squares[ypos-2][xpos].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                    console.log((ypos-2)+","+xpos);
                    movea_space.push([(ypos-2),xpos]);
            }
            // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
            if((ypos-1)>=0) { //폰의 한 칸 앞이 존재하고
                // console.log('pawn catch');
                //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos-1)>=0) && squares[ypos-1][xpos-1].camp=='black'){ 
                    console.log('front left');
                    console.log((ypos-1)+","+(xpos-1));
                    movea_space.push([(ypos-1),(xpos-1)]);
                }
                //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos+1)<=7) && squares[ypos-1][xpos+1].camp=='black'){ 
                    console.log('front right');
                    console.log((ypos-1)+","+(xpos+1));
                    movea_space.push([(ypos-1),(xpos+1)]);
                }
            }
        }else if(camp=='black'){
            if((ypos+1)<=7 && squares[ypos+1][xpos].value==''){ //폰의 한 칸 앞이 존재하고 비었다면
                console.log((ypos+1)+","+xpos);
                movea_space.push([(ypos+1),xpos]);
            }
            // console.log(p[1]);
            if(ypos==1 && squares[ypos+1][xpos].value=='' 
                && squares[ypos+2][xpos].value==''){ //세로 좌표가 그대로이고 한칸 앞과 두칸 앞이 비었다면
                    console.log((ypos+2)+","+xpos);
                    movea_space.push([(ypos+2),xpos]);
            }
            // console.log(!((p[1][1]-1)<0) || !((p[1][1]+1)>7));
            if((ypos+1)<=7) { //폰의 한 칸 앞이 존재하고
                // console.log('pawn catch');
                //왼쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos-1)>=0) && squares[ypos+1][xpos-1].camp=='white'){ 
                    console.log('front left');
                    console.log((ypos+1)+","+(xpos-1));
                    movea_space.push([(ypos+1),(xpos-1)]);
                }
                //오른쪽 칸이 존재하며 대각선 앞에 상대 진영의 말이 있다면
                if(((xpos+1)<=7) && squares[ypos+1][xpos+1].camp=='white'){ 
                    console.log('front right');
                    console.log((ypos+1)+","+(xpos+1));
                    movea_space.push([(ypos+1),(xpos+1)]);
                }
            }
        }
    }
    check_pawn_moveable(xpos,ypos,camp,movea_space){
        // movea_space.push([ypos,xpos]);
        if(camp=='white'){
            if((ypos-1)>=0) { //폰의 한 칸 앞이 존재하고
                // console.log('pawn catch');
                //왼쪽 칸이 존재하면
                if(((xpos-1)>=0)){ 
                    console.log('front left');
                    console.log((ypos-1)+","+(xpos-1));
                    movea_space.push([(ypos-1),(xpos-1)]);
                }
                //오른쪽 칸이 존재하면
                if(((xpos+1)<=7)){ 
                    console.log('front right');
                    console.log((ypos-1)+","+(xpos+1));
                    movea_space.push([(ypos-1),(xpos+1)]);
                }
            }
        }else if(camp=='black'){
            if((ypos+1)<=7) { //폰의 한 칸 앞이 존재하고
                // console.log('pawn catch');
                //왼쪽 칸이 존재하면
                if(((xpos-1)>=0)){ 
                    console.log('front left');
                    console.log((ypos+1)+","+(xpos-1));
                    movea_space.push([(ypos+1),(xpos-1)]);
                }
                //오른쪽 칸이 존재하면
                if(((xpos+1)<=7)){ 
                    console.log('front right');
                    console.log((ypos+1)+","+(xpos+1));
                    movea_space.push([(ypos+1),(xpos+1)]);
                }
            }
        }
    }
    rook_moveable(sqrs,r_king_pos,xpos,ypos,camp,movea_space,check){
        const squares = sqrs;
        let rival = (camp=='white'? 'black':'white');
        let rival_king_pos = r_king_pos;
        let rival_king_movea = [];
        this.king_moveable(squares,rival_king_pos[1],rival_king_pos[0],rival,rival_king_movea);
        let go = Array(4).fill(true);
        let uncheck = true;
        for(let i=1;i<8;i++){ 
            //가로이동
            //i칸 왼쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
            if(go[0]==true && (xpos-i)>=0){ 
                if(squares[ypos][xpos-i].camp!=camp){
                    console.log('horizonal-');
                    console.log(squares[ypos][xpos-i]);
                    movea_space.push([ypos,(xpos-i)]);
                    //i칸 위쪽의 진영이 상대방일 때
                    if(squares[ypos][xpos-i].camp==rival){
                        // console.log(ypos+','+(xpos-i));
                        // console.log(rival_king_pos[0]+','+rival_king_pos[1]);
                        if(ypos==rival_king_pos[0] && (xpos-i)==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (xpos-(i+1))>=0){
                                if(squares[ypos][xpos-(i+1)].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('horizonal-');
                                    console.log('cant move?'+squares[ypos][xpos-(i+1)]);
                                    movea_space.push([ypos,(xpos-(i+1))]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((xpos-(i+k))>=0){
                                    console.log(squares[ypos][(xpos-(i+k))]);
                                    if((rival_king_pos[0]==ypos && rival_king_pos[1]==(xpos-(i+k)))){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([ypos,(xpos-(i+k))]);
                                        break;
                                    }
                                    if(squares[ypos][(xpos-(i+k))].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        // document.getElementsByClassName("board-row")[ypos].children[(xpos-(i+k))].classList.add('unmoveable');
                                        uncheck_movea.push([ypos,(xpos-(i+k))]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                uncheck = false;
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                            }
                        }
                        go[0]=false;
                    }
                }else{
                    if(check){
                        console.log('now'+ypos+','+(xpos-(i+1)));
                        console.log('king?'+rival_king_pos);
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==ypos && rival_king_movea[k][1]==(xpos-i)){
                                console.log('cant move');
                                console.log('horizonal-');
                                console.log(squares[ypos][xpos-i]);
                                movea_space.push([ypos,(xpos-i)]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([ypos,(xpos-i)]);
                    }
                    go[0]=false;
                }
            }
            //i칸 오른쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
            if(go[1]==true && (xpos+i)<=7){ 
                if(squares[ypos][xpos+i].camp!=camp){
                    console.log('horizonal+');
                    console.log(squares[ypos][xpos+i]);
                    movea_space.push([ypos,(xpos+i)]);
                    //i칸 위쪽의 진영이 상대방일 때
                    if(squares[ypos][xpos+i].camp==rival){
                        if(ypos==rival_king_pos[0] && (xpos+i)==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (xpos+(i+1))<=7){
                                if(squares[ypos][xpos+(i+1)].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('horizonal+');
                                    console.log('cant move?'+squares[ypos][xpos+(i+1)]);
                                    movea_space.push([ypos,(xpos+(i+1))]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((xpos+(i+k))<=7){
                                    console.log(squares[ypos][(xpos+(i+k))]);
                                    if((rival_king_pos[0]==ypos && rival_king_pos[1]==(xpos+(i+k)))){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([ypos,(xpos+(i+k))]);
                                        break;
                                    }
                                    if(squares[ypos][(xpos+(i+k))].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        // document.getElementsByClassName("board-row")[ypos].children[(xpos+(i+k))].classList.add('unmoveable');
                                        uncheck_movea.push([ypos,(xpos+(i+k))]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                uncheck = false;
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                            }
                        }
                        go[1]=false;
                    }
                }else{
                    if(check){
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==ypos && rival_king_movea[k][1]==(xpos+i)){
                                console.log('cant move');
                                console.log('horizonal+');
                                console.log(squares[ypos][xpos+i]);
                                movea_space.push([ypos,(xpos+i)]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([ypos,(xpos+i)]);
                    }
                    go[1]=false;
                }
            }
            //세로이동
            //i칸 위쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
            if(go[2]==true && (ypos-i)>=0){ 
                if(squares[ypos-i][xpos].camp!=camp){
                    console.log('vertical-');
                    console.log(squares[ypos-i][xpos]);
                    movea_space.push([(ypos-i),xpos]);
                    //i칸 위쪽의 진영이 상대방일 때
                    if(squares[ypos-i][xpos].camp==rival){
                        if((ypos-i)==rival_king_pos[0] && xpos==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (ypos-(i+1))>=0){
                                if(squares[ypos-(i+1)][xpos].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('vertical-');
                                    console.log('cant move?'+squares[ypos-(i+1)][xpos]);
                                    movea_space.push([(ypos-(i+1)),xpos]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((ypos-(i+k))>=0){
                                    console.log(squares[(ypos-(i+k))][xpos]);
                                    if((rival_king_pos[0]==(ypos-(i+k)) && rival_king_pos[1]==xpos)){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([(ypos-(i+k)),xpos]);
                                        break;
                                    }
                                    if(squares[(ypos-(i+k))][xpos].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq');
                                        console.log(squares[ypos][(xpos-(i+k))]);
                                        // document.getElementsByClassName("board-row")[(ypos-(i+k))].children[xpos].classList.add('unmoveable');
                                        uncheck_movea.push([(ypos-(i+k)),xpos]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                console.log('wwwwwwwwwwwwwwwwww');
                                uncheck = false;
                                console.log(movea_space);
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                                console.log(movea_space);
                            }
                        }
                        go[2]=false;
                    }
                }else{
                    if(check){
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==(ypos-i) && rival_king_movea[k][1]==xpos){
                                console.log('cant move');
                                console.log('vertical-');
                                console.log(squares[ypos-i][xpos]);
                                movea_space.push([(ypos-i),xpos]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([(ypos-i),xpos]);
                    }
                    go[2]=false;
                }
            }
            //i칸 아래쪽이 존재하고 현재 진영 칸이 아니며 연속으로 그러할 때
            if(go[3]==true && (ypos+i)<=7){ 
                if(squares[ypos+i][xpos].camp!=camp){
                    console.log('vertical+');
                    console.log(squares[ypos+i][xpos]);
                    movea_space.push([(ypos+i),xpos]);
                    //i칸 위쪽의 진영이 상대방일 때
                    if(squares[ypos+i][xpos].camp==rival){
                        if((ypos+i)==rival_king_pos[0] && xpos==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (ypos+(i+1))<=7){
                                if(squares[ypos+(i+1)][xpos].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('vertical+');
                                    console.log('cant move?'+squares[ypos+(i+1)][xpos]);
                                    movea_space.push([(ypos+(i+1)),xpos]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((ypos+(i+k))<=7){
                                    console.log(squares[(ypos+(i+k))][xpos]);
                                    if((rival_king_pos[0]==(ypos+(i+k)) && rival_king_pos[1]==xpos)){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([(ypos+(i+k)),xpos]);
                                        break;
                                    }
                                    if(squares[(ypos+(i+k))][xpos].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        // document.getElementsByClassName("board-row")[(ypos+(i+k))].children[xpos].classList.add('unmoveable');
                                        uncheck_movea.push([(ypos+(i+k)),xpos]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                uncheck = false;
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                            }
                        }
                        go[3]=false;
                    }
                }else{
                    if(check){
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==(ypos+i) && rival_king_movea[k][1]==xpos){
                                console.log('cant move');
                                console.log('vertical+');
                                console.log(squares[ypos+i][xpos]);
                                movea_space.push([(ypos+i),xpos]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([(ypos+i),xpos]);
                    }
                    go[3]=false;
                }
            }
        }

        // if(check && camp=='white'){
        //     for(let i=0;i<movea_space.length;i++){
        //         document.getElementsByClassName("board-row")[movea_space[i][0]].children[movea_space[i][1]].classList.add('unmoveable');
        //     }
        // }
    }
    bishop_moveable(sqrs,r_king_pos,xpos,ypos,camp,movea_space,check){
        const squares = sqrs;
        let rival = (camp=='white'? 'black':'white');
        let rival_king_pos = r_king_pos;
        let rival_king_movea = [];
        this.king_moveable(squares,rival_king_pos[1],rival_king_pos[0],rival,rival_king_movea);
        //연속으로 이동 가능한 칸인지 검사할 배열
        let go = Array(4).fill(true);
        let uncheck = true;
        for(let i=1;i<8;i++){
            //좌측상단 이동
            //i칸 위쪽이 존재하고 i칸 좌측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
            if(go[0]==true && (ypos-i)>=0 && (xpos-i)>=0){ 
                if(squares[ypos-i][xpos-i].camp!=camp){
                    console.log('left-');
                    console.log(squares[ypos-i][xpos-i].camp);
                    movea_space.push([(ypos-i),(xpos-i)]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(squares[ypos-i][xpos-i].camp==rival){
                        if((ypos-i)==rival_king_pos[0] && (xpos-i)==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (ypos-(i+1))>=0 && (xpos-(i+1))>=0){
                                if(squares[ypos-(i+1)][xpos-(i+1)].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('left-');
                                    console.log('cant move?'+squares[ypos-(i+1)][xpos-(i+1)]);
                                    movea_space.push([(ypos-(i+1)),(xpos-(i+1))]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((ypos-(i+k))>=0 && (xpos-(i+k))>=0){
                                    console.log(squares[(ypos-(i+k))][(xpos-(i+k))]);
                                    if((rival_king_pos[0]==(ypos-(i+k)) && rival_king_pos[1]==(xpos-(i+k)))){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([(ypos-(i+k)),(xpos-(i+k))]);
                                        break;
                                    }
                                    if(squares[(ypos-(i+k))][(xpos-(i+k))].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        // document.getElementsByClassName("board-row")[(ypos-(i+k))].children[(xpos-(i+k))].classList.add('unmoveable');
                                        uncheck_movea.push([(ypos-(i+k)),(xpos-(i+k))]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                uncheck = false;
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                            }
                        }
                        go[0]=false;
                    }
                }else{
                    if(check){
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==(ypos-i) && rival_king_movea[k][1]==(xpos-i)){
                                console.log('cant move');
                                console.log('left-');
                                console.log(squares[ypos-i][xpos-i].camp);
                                movea_space.push([(ypos-i),(xpos-i)]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([(ypos-i),(xpos-i)]);
                    }
                    go[0]=false;
                }
            }

            //우측하단 이동
            //i칸 아래쪽이 존재하고 i칸 우측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
            if(go[1]==true && (ypos+i)<=7 && (xpos+i)<=7){ 
                if(squares[ypos+i][xpos+i].camp!=camp){
                    console.log('right+');
                    console.log(squares[ypos+i][xpos+i].camp);
                    movea_space.push([(ypos+i),(xpos+i)]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(squares[ypos+i][xpos+i].camp==rival){
                        if((ypos+i)==rival_king_pos[0] && (xpos+i)==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (ypos+(i+1))<=7 && (xpos+(i+1))<=7){
                                if(squares[ypos+(i+1)][xpos+(i+1)].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('right+');
                                    console.log('cant move?'+squares[ypos+(i+1)][xpos+(i+1)]);
                                    movea_space.push([(ypos+(i+1)),(xpos+(i+1))]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((ypos+(i+k))<=7 && (xpos+(i+k))<=7){
                                    console.log(squares[(ypos+(i+k))][(xpos+(i+k))]);
                                    if((rival_king_pos[0]==(ypos+(i+k)) && rival_king_pos[1]==(xpos+(i+k)))){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([(ypos+(i+k)),(xpos+(i+k))]);
                                        break;
                                    }
                                    if(squares[(ypos+(i+k))][(xpos+(i+k))].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        // document.getElementsByClassName("board-row")[(ypos+(i+k))].children[(xpos+(i+k))].classList.add('unmoveable');
                                        uncheck_movea.push([(ypos+(i+k)),(xpos+(i+k))]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                uncheck = false;
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                            }
                        }
                        go[1]=false;
                    }
                }else{
                    if(check){
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==(ypos+i) && rival_king_movea[k][1]==(xpos+i)){
                                console.log('cant move');
                                console.log('right+');
                                console.log(squares[ypos+i][xpos+i].camp);
                                movea_space.push([(ypos+i),(xpos+i)]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([(ypos+i),(xpos+i)]);
                    }
                    go[1]=false;
                }
            }

            //우측상단 이동
            //i칸 위쪽이 존재하고 i칸 우측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
            if(go[2]==true && (ypos-i)>=0 && (xpos+i)<=7){ 
                if(squares[ypos-i][xpos+i].camp!=camp){
                    console.log('right-');
                    console.log(squares[ypos-i][xpos+i].camp);
                    movea_space.push([(ypos-i),(xpos+i)]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(squares[ypos-i][xpos+i].camp==rival){
                        if((ypos-i)==rival_king_pos[0] && (xpos+i)==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (ypos-(i+1))>=0 && (xpos+(i+1))<=7){
                                if(squares[ypos-(i+1)][xpos+(i+1)].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('right-');
                                    console.log('cant move?'+squares[ypos-(i+1)][xpos+(i+1)]);
                                    movea_space.push([(ypos-(i+1)),(xpos+(i+1))]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((ypos-(i+k))>=0 && (xpos+(i+k))<=7){
                                    console.log(squares[(ypos-(i+k))][(xpos+(i+k))]);
                                    if((rival_king_pos[0]==(ypos-(i+k)) && rival_king_pos[1]==(xpos+(i+k)))){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([(ypos-(i+k)),(xpos+(i+k))]);
                                        break;
                                    }
                                    if(squares[(ypos-(i+k))][(xpos+(i+k))].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        // document.getElementsByClassName("board-row")[(ypos-(i+k))].children[(xpos+(i+k))].classList.add('unmoveable');
                                        uncheck_movea.push([(ypos-(i+k)),(xpos+(i+k))]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                uncheck = false;
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                            }
                        }
                        go[2]=false;
                    }
                }else{
                    if(check){
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==(ypos-i) && rival_king_movea[k][1]==(xpos+i)){
                                console.log('cant move');
                                console.log('right-');
                                console.log(squares[ypos-i][xpos+i].camp);
                                movea_space.push([(ypos-i),(xpos+i)]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([(ypos-i),(xpos+i)]);
                    }
                    go[2]=false;
                }
            }

            //좌측하단 이동
            //i칸 아래쪽이 존재하고 i칸 좌측이 존재하며 해당 칸의 진영이 현재 진영이 아닌 것이 연속될 때
            if(go[3]==true && (ypos+i)<=7 && (xpos-i)>=0){ 
                if(squares[ypos+i][xpos-i].camp!=camp){
                    console.log('left+');
                    console.log(squares[ypos+i][xpos-i].camp);
                    movea_space.push([(ypos+i),(xpos-i)]);
                    //해당 칸의 진영이 상대 진영일 때
                    if(squares[ypos+i][xpos-i].camp==rival){
                        if((ypos+i)==rival_king_pos[0] && (xpos-i)==rival_king_pos[1]){
                            if(check==false){
                                this.state.queen = 'check';
                                console.log('***********queen '+this.state.queen+'************');
                                movea_space.push([ypos,xpos]);
                            }else if(check && (ypos+(i+1))<=7 && (xpos-(i+1))>=0){
                                if(squares[ypos+(i+1)][xpos-(i+1)].camp!=rival){
                                    //킹과 현재 말 사이가 비어있고 킹이 이동 가능한 칸이 현재 말의 이동경로와 겹치면 킹 이동 불가
                                    console.log('cant move');
                                    console.log('left+');
                                    console.log('cant move?'+squares[ypos+(i+1)][xpos-(i+1)]);
                                    movea_space.push([(ypos+(i+1)),(xpos-(i+1))]);
                                }
                            }
                        }else if(uncheck && check==false && camp!=this.state.next){
                            //false를 받고 상대 진영의 말을 검사하는 경우
                            //검사하려는 말의 경로와 킹 사이에 현재 움직이려는 말이 있을 경우 해당 말은 검사하려는 말의 체크를 막아야만 함
                            console.log('ffffffffffffffffffffffffffffffffffff');
                            let uncheck_movea = [];
                            uncheck_movea.push([ypos,xpos]);
                            for(let k=1;k<7;k++){
                                if((ypos+(i+k))<=7 && (xpos-(i+k))>=0){
                                    console.log(squares[(ypos+(i+k))][(xpos-(i+k))]);
                                    if((rival_king_pos[0]==(ypos+(i+k)) && rival_king_pos[1]==(xpos-(i+k)))){
                                        //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 있으면 배열 끝내기
                                        console.log('4444444444444444444444444444444');
                                        uncheck_movea.push([(ypos+(i+k)),(xpos-(i+k))]);
                                        break;
                                    }
                                    if(squares[(ypos+(i+k))][(xpos-(i+k))].camp==''){
                                        //상대 말 뒤쪽으로 이어지는 경로가 계속 비어있으면 해당 상대 말 이동가능
                                        // document.getElementsByClassName("board-row")[(ypos+(i+k))].children[(xpos-(i+k))].classList.add('unmoveable');
                                        uncheck_movea.push([(ypos+(i+k)),(xpos-(i+k))]);
                                    }else{
                                        //상대 말 뒤쪽으로 이어지는 경로에 다른 말이 존재할 경우 체크 위험이 없으므로 상대 말 제한 필요없음
                                        uncheck_movea = [];
                                        break;
                                    }
                                }else{
                                    //상대 말 뒤쪽으로 이어지는 경로 끝에 킹이 없으면 상대 말 제한 필요없음
                                    uncheck_movea = [];
                                    break;
                                }
                            }
                            if(uncheck_movea.length>0){
                                uncheck = false;
                                for(let k=0;k<uncheck_movea.length;k++){
                                    movea_space.push(uncheck_movea[k]);
                                }
                            }
                        }
                        go[3]=false;
                    }
                }else{
                    if(check){
                        //현재 말 이동경로에 아군 말이 하나 있고 킹의 이동경로와 겹치는 경우 킹 이동 불가
                        for(let k=0;k<rival_king_movea.length;k++){
                            if(rival_king_movea[k][0]==(ypos+i) && rival_king_movea[k][1]==(xpos-i)){
                                console.log('cant move');
                                console.log('left+');
                                console.log(squares[ypos+i][xpos-i].camp);
                                movea_space.push([(ypos+i),(xpos-i)]);
                                break;
                            }
                        }
                    }else if(uncheck && check==false && camp!=this.state.next){
                        movea_space.push([(ypos+i),(xpos-i)]);
                    }
                    go[3]=false;
                }
            }
        }
    }
    knight_moveable(sqrs,xpos,ypos,camp,movea_space){
        const squares = sqrs;
        console.log(ypos+","+xpos);
        //좌측 상하
        if(xpos-2>=0){
            if(ypos-1>=0 && squares[ypos-1][xpos-2].camp!=camp){
                console.log((ypos-1)+","+(xpos-2));
                movea_space.push([(ypos-1),(xpos-2)]);
            }
            if(ypos+1<=7 && squares[ypos+1][xpos-2].camp!=camp){
                console.log((ypos+1)+","+(xpos-2));
                movea_space.push([(ypos+1),(xpos-2)]);
            }
        }
        //우측 상하
        if(xpos+2<=7){
            if(ypos-1>=0 && squares[ypos-1][xpos+2].camp!=camp){
                console.log((ypos-1)+","+(xpos+2));
                movea_space.push([(ypos-1),(xpos+2)]);
            }
            if(ypos+1<=7 && squares[ypos+1][xpos+2].camp!=camp){
                console.log((ypos+1)+","+(xpos+2));
                movea_space.push([(ypos+1),(xpos+2)]);
            }
        }
        //하단 좌우
        if(ypos+2<=7){
            if(xpos-1>=0 && squares[ypos+2][xpos-1].camp!=camp){
                console.log((ypos+2)+","+(xpos-1));
                movea_space.push([(ypos+2),(xpos-1)]);
            }
            if(xpos+1<=7 && squares[ypos+2][xpos+1].camp!=camp){
                console.log((ypos+2)+","+(xpos+1));
                movea_space.push([(ypos+2),(xpos+1)]);
            }
        }
        //상단 좌우
        if(ypos-2>=0){
            if(xpos-1>=0 && squares[ypos-2][xpos-1].camp!=camp){
                console.log((ypos-2)+","+(xpos-1));
                movea_space.push([(ypos-2),(xpos-1)]);
            }
            if(xpos+1<=7 && squares[ypos-2][xpos+1].camp!=camp){
                console.log((ypos-2)+","+(xpos+1));
                movea_space.push([(ypos-2),(xpos+1)]);
            }
        }
    }
    check_knight_moveable(xpos,ypos,movea_space){
        console.log(ypos+","+xpos);
        //좌측 상하
        if(xpos-2>=0){
            if(ypos-1>=0){
                console.log((ypos-1)+","+(xpos-2));
                movea_space.push([(ypos-1),(xpos-2)]);
            }
            if(ypos+1<=7){
                console.log((ypos+1)+","+(xpos-2));
                movea_space.push([(ypos+1),(xpos-2)]);
            }
        }
        //우측 상하
        if(xpos+2<=7){
            if(ypos-1>=0){
                console.log((ypos-1)+","+(xpos+2));
                movea_space.push([(ypos-1),(xpos+2)]);
            }
            if(ypos+1<=7){
                console.log((ypos+1)+","+(xpos+2));
                movea_space.push([(ypos+1),(xpos+2)]);
            }
        }
        //하단 좌우
        if(ypos+2<=7){
            if(xpos-1>=0){
                console.log((ypos+2)+","+(xpos-1));
                movea_space.push([(ypos+2),(xpos-1)]);
            }
            if(xpos+1<=7){
                console.log((ypos+2)+","+(xpos+1));
                movea_space.push([(ypos+2),(xpos+1)]);
            }
        }
        //상단 좌우
        if(ypos-2>=0){
            if(xpos-1>=0){
                console.log((ypos-2)+","+(xpos-1));
                movea_space.push([(ypos-2),(xpos-1)]);
            }
            if(xpos+1<=7){
                console.log((ypos-2)+","+(xpos+1));
                movea_space.push([(ypos-2),(xpos+1)]);
            }
        }
    }
    king_moveable(sqrs,xpos,ypos,camp,movea_space){
        const squares = sqrs;
        console.log(squares);
        if(xpos-1>=0){
            if(squares[ypos][xpos-1].camp!=camp){
                movea_space.push([ypos,(xpos-1)]);
            }
            if(ypos-1>=0 && squares[ypos-1][xpos-1].camp!=camp){
                movea_space.push([(ypos-1),(xpos-1)]);
            }
            if(ypos+1<=7 && squares[ypos+1][xpos-1].camp!=camp){
                movea_space.push([(ypos+1),(xpos-1)]);
            }
        }
        if(xpos+1<=7){
            if(squares[ypos][xpos+1].camp!=camp){
                movea_space.push([ypos,(xpos+1)]);
            }
            if(ypos-1>=0 && squares[ypos-1][xpos+1].camp!=camp){
                movea_space.push([(ypos-1),(xpos+1)]);
            }
            if(ypos+1<=7 && squares[ypos+1][xpos+1].camp!=camp){
                movea_space.push([(ypos+1),(xpos+1)]);
            }
        }
        if(ypos+1<=7 && squares[ypos+1][xpos].camp!=camp){
            movea_space.push([(ypos+1),xpos]);
        }
        if(ypos-1>=0 && squares[ypos-1][xpos].camp!=camp){
            movea_space.push([(ypos-1),xpos]);
        }
    }
    check_king_moveable(xpos,ypos,movea_space){
        if(xpos-1>=0){
            movea_space.push([ypos,(xpos-1)]);
            if(ypos-1>=0){
                movea_space.push([(ypos-1),(xpos-1)]);
            }
            if(ypos+1<=7){
                movea_space.push([(ypos+1),(xpos-1)]);
            }
        }
        if(xpos+1<=7){
            movea_space.push([ypos,(xpos+1)]);
            if(ypos-1>=0){
                movea_space.push([(ypos-1),(xpos+1)]);
            }
            if(ypos+1<=7){
                movea_space.push([(ypos+1),(xpos+1)]);
            }
        }
        if(ypos+1<=7){
            movea_space.push([(ypos+1),xpos]);
        }
        if(ypos-1>=0){
            movea_space.push([(ypos-1),xpos]);
        }
    }
    calc_all_moveable(sqrs,w_king_pos,b_king_pos,camp,movea_space,check){
        const squares = sqrs;
        let cur_chk_path = [];
        let check_flag = false;
        console.log(camp);
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if(squares[i][j].camp==camp){
                    console.log(squares[i][j].camp==camp);
                    console.log(squares[i][j].camp + squares[i][j].piece);
                    if(check){
                        //체크 판단
                        cur_chk_path = this.check(squares,w_king_pos,b_king_pos,j,i,camp,squares[i][j].piece);
                        if(cur_chk_path.length>0){
                            check_flag = true;
                            break;
                        }
                    }else if(check==false){
                        // if(camp!=this.state.next && squares[i][j].piece=='pawn'){
                        //     this.calc_moveable(squares,w_king_pos,b_king_pos,j,i,squares[i][j].piece,camp,movea_space,true);
                        // }else{
                            this.calc_moveable(squares,w_king_pos,b_king_pos,j,i,squares[i][j].piece,camp,movea_space,false);
                        // }
                    }else{
                        this.calc_moveable(squares,w_king_pos,b_king_pos,j,i,squares[i][j].piece,camp,movea_space,true);
                    }
                }
            }
            if(check_flag){
                break;
            }
        }
        //movea_space = new Set(movea_space);
        //console.log(movea_space);
        if(check){
            return cur_chk_path;
        }
        return;
    }

    calc_moveable(sqrs,w_king_pos,b_king_pos,xpos,ypos,piece,camp,movea_space,check){
        // let rival = (camp=='white'? 'black':'white');
        let r_king_pos = (camp=='white'? b_king_pos:w_king_pos);

        // console.log("camp:"+camp);
        // console.log("rival:"+rival);
        switch(piece){
            case 'pawn':
                {   
                    if(check){
                        this.check_pawn_moveable(xpos,ypos,camp,movea_space);
                    }else{
                        this.pawn_moveable(sqrs,xpos,ypos,camp,movea_space);
                    }
                }
                break;
            case 'rook':
                {
                    this.rook_moveable(sqrs,r_king_pos,xpos,ypos,camp,movea_space,check);
                    this.state.queen = null;
                }
                break;
            case 'bishop':
                {
                    this.bishop_moveable(sqrs,r_king_pos,xpos,ypos,camp,movea_space,check);
                    this.state.queen = null;
                }
                break;
            case 'queen':
                {
                    let rook_movea = [];
                    let bishop_movea = [];
                    this.rook_moveable(sqrs,r_king_pos,xpos,ypos,camp,rook_movea,check);
                    console.log(check);
                    if(check==false){
                        if(camp!=this.state.next){
                            console.log('moveable');
                            this.bishop_moveable(sqrs,r_king_pos,xpos,ypos,camp,bishop_movea,check);
                        }else{
                            console.log('checking');
                            if(this.state.queen!='check') {
                                rook_movea = [];
                                this.bishop_moveable(sqrs,r_king_pos,xpos,ypos,camp,bishop_movea,check);
                                if(this.state.queen!='check') {
                                    bishop_movea = [];
                                }
                            }
                        }
                    }else if(check==true||check==undefined){
                        console.log('moveable');
                        this.bishop_moveable(sqrs,r_king_pos,xpos,ypos,camp,bishop_movea,check);
                    }
                    console.log('rook'+rook_movea);
                    console.log('bishop'+bishop_movea);
                    for(let i=0;i<rook_movea.length;i++){
                        movea_space.push(rook_movea[i]);
                    }
                    for(let i=0;i<bishop_movea.length;i++){
                        movea_space.push(bishop_movea[i]);
                    }
                    this.state.queen = null;
                }
                break;
            case 'knight':
                {
                    if(check){
                        this.check_knight_moveable(xpos,ypos,movea_space);
                    }else{
                        this.knight_moveable(sqrs,xpos,ypos,camp,movea_space);
                    }
                }
                break;
            case 'king':
                {
                    if(check){
                        this.check_king_moveable(xpos,ypos,movea_space);
                    }else{
                        this.king_moveable(sqrs,xpos,ypos,camp,movea_space);
                    }
                }
                break;
        }
    }



    check(sqrs,w_king_pos,b_king_pos,xpos,ypos,camp,piece){
        const squares = sqrs;
        let chk_path = [];
        //움직인 말의 다음 경로를 저장하여 킹이 해당 경로에 포함되는지 확인하기 위한 배열 
        let chk_check = [];
        let r_king_pos = (camp=='white'? b_king_pos:w_king_pos);
        let rival_king_pos = r_king_pos;
        console.log(rival_king_pos);
        console.log('////////////////check start///////////////');
        console.log(piece);
        if(camp!=this.state.next){
            console.log('pppppppppppppppppppppppppppppppppppp');
        }
        this.calc_moveable(squares,w_king_pos,b_king_pos,xpos,ypos,piece,camp,chk_check,(piece=='pawn'?true:false));
        for(let i=0;i<chk_check.length;i++){
            console.log(chk_check[i]);
            if(chk_check[i][0]==rival_king_pos[0] && chk_check[i][1]==rival_king_pos[1]){
                // console.log('**********check**********');
                //체크중인 말을 막기 위한 경로를 저장하기 위한 배열
                let check_movea = chk_check;
                if(!(piece=='knight' || piece=='pawn')){
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
                }
                check_movea.push([ypos,xpos]);
                console.log('a:'+check_movea);
                chk_path = check_movea;

                break;
            }
        }
        console.log('checked?'+chk_path);

        return chk_path;
    }

    checkmate(sqrs,w_king_pos,b_king_pos,cur_chk_path){
        const squares = sqrs;
        let chk_path = cur_chk_path;
        //체크메이트
        let r_king_pos = (this.state.next=='white'? b_king_pos:w_king_pos);
        let rival_king_pos = r_king_pos;
        let rival_king_movea = [];
        let rival_king_unmovea = [];
        let check_unmovea = [];
        let next_rival = (this.state.next=='white'? 'black':'white');
        this.king_moveable(squares,rival_king_pos[1],rival_king_pos[0],next_rival,rival_king_movea);
        console.log('checkmate: '+rival_king_movea.length);
        console.log("next_rival:"+next_rival);

        //상대 킹이 움직일 수 있는 경로
        if(rival_king_movea.length>0){
            this.calc_all_moveable(squares,w_king_pos,b_king_pos,this.state.next,rival_king_unmovea);

            rival_king_unmovea = new Set(rival_king_unmovea);
            console.log(rival_king_unmovea);

            for(let item of rival_king_unmovea.keys()){
                rival_king_movea = rival_king_movea.filter(v=>{
                    return !(v[0]==item[0] && v[1]==item[1]);
                });
            }
            console.log(rival_king_movea);
        }

        //체크한 말을 막거나 잡을 수 있는 말
        let flag=false;
        if(chk_path.length>0){
            flag = true;
            this.calc_all_moveable(squares,w_king_pos,b_king_pos,next_rival,check_unmovea);

            check_unmovea = new Set(check_unmovea);
            console.log(check_unmovea);


            for(let item of check_unmovea.keys()){
                for(let i=0;i<chk_path.length;i++){
                    console.log(i+item+':'+chk_path[i]);
                    if(item[0]==chk_path[i][0] && item[1]==chk_path[i][1]){
                        console.log(item);
                        flag = false;
                        break;
                    }
                }
                if(!flag) break;
            }
        }
        console.log('222222222222'+chk_path);
        console.log(flag);
        if(rival_king_movea.length==0){
            if(chk_path.length==0){
                let next_movea = [];
                this.calc_all_moveable(squares,w_king_pos,b_king_pos,next_rival,next_movea);
                if(next_movea.length==0){
                    console.log('-----------stalemate----------');
                    for(let i=0;i<64;i++){
                        document.getElementsByClassName("square")[i].disabled = true;
                    }
                    return ('stalemate');
                }else{
                    console.log('=======continue========');
                    return ('continue');
                }
            }else if(flag && chk_path.length>0){
                console.log('!!!!!!!!!!!!!!!!!checkmate!!!!!!!!!!!!!!!!!');
                for(let i=0;i<64;i++){
                    document.getElementsByClassName("square")[i].disabled = true;
                }
                return ('checkmate');
            }else{
                console.log('##########check##########');
                console.log('=======continue========');
                return ('check');
            }
        }else{
            if(chk_path.length>0){
                console.log('##########check##########');
                console.log('=======continue========');
                return ('check');
            }else{
                console.log('=======continue========');
                return ('continue');
            }
        }
    }

    draw(w_pc,b_pc){
        const w_pieces = w_pc;
        const b_pieces = b_pc;
        let next_pieces = (this.state.next=='black'?b_pieces:w_pieces);
        let rival_pieces = (this.state.next=='white'?b_pieces:w_pieces);
        if(rival_pieces.queen==0 && rival_pieces.bishop==0 && 
            rival_pieces.knight==0 && rival_pieces.rook==0 && 
            rival_pieces.pawn==0){
            if(next_pieces.queen==0 && next_pieces.rook==0 
                && next_pieces.pawn==0){
                if((next_pieces.bishop==1 && next_pieces.knight==0) 
                    || (next_pieces.bishop==0 && next_pieces.knight==1)){
                    //draw
                    console.log('&&&&&&&&&&&draw&&&&&&&&&&');
                    for(let i=0;i<64;i++){
                        document.getElementsByClassName("square")[i].disabled = true;
                    }
                    return ('draw');
                }else if(next_pieces.bishop==0 && next_pieces.knight==0){
                    //draw
                    console.log('&&&&&&&&&&&draw&&&&&&&&&&');
                    for(let i=0;i<64;i++){
                        document.getElementsByClassName("square")[i].disabled = true;
                    }
                    return ('draw');
                }
            }
        }
        return ('continue');
    }
    

    promotion(val,pc){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        console.log(history);
        const current = history[history.length-1];
        const squares = [];
        for(let i=0;i<8;i++){
            let square_rows = [];
            for(let j=0;j<8;j++){
                square_rows.push({
                    value: current.squares[i][j].value,
                    camp: current.squares[i][j].camp,
                    piece: current.squares[i][j].piece
                });
            }
            squares.push(square_rows);
        }
        let w_king_pos = current.white_king_pos.slice();
        let b_king_pos = current.black_king_pos.slice();
        let chk_path = current.check_path.slice();
        let game = current.game.slice();
        const white_pieces = current.white_pieces;
        const w_pieces = {
            king:  white_pieces.king,
            queen:  white_pieces.queen,
            bishop:  white_pieces.bishop,
            knight:  white_pieces.knight,
            rook:  white_pieces.rook,
            pawn:  white_pieces.pawn
        };
        const black_pieces = current.black_pieces;
        const b_pieces = {
            king:  black_pieces.king,
            queen:  black_pieces.queen,
            bishop:  black_pieces.bishop,
            knight:  black_pieces.knight,
            rook:  black_pieces.rook,
            pawn:  black_pieces.pawn
        };

        console.log(val+','+pc+','+this.state.promotion);
        squares[this.state.promotion[0]][this.state.promotion[1]].value = val;
        squares[this.state.promotion[0]][this.state.promotion[1]].piece = pc;

        let rival_pieces = (this.state.next=='white'?b_pieces:w_pieces);
        if(this.state.next=='white'){
            b_pieces[pc] = rival_pieces[pc]+1;
            console.log('black pieces?'+pc+b_pieces[pc]);
        }else if(this.state.next=='black'){
            w_pieces[pc] = rival_pieces[pc]+1;
            console.log('white pieces?'+pc+w_pieces[pc]);
        }

        game = this.draw(w_pieces,b_pieces);
        //승부 판정
        if(game!='draw'){
            chk_path = this.check(squares,w_king_pos,b_king_pos,this.state.promotion[1],this.state.promotion[0],this.state.next,pc);
            if(chk_path.length==0){
                chk_path = this.calc_all_moveable(squares,w_king_pos,b_king_pos,this.state.next,[],true);
            }
            game = this.checkmate(squares,w_king_pos,b_king_pos,chk_path);
        }

        this.setState({
            // history: history,
            history: history.concat([{
                squares: squares,
                black_king_pos: b_king_pos,
                white_king_pos: w_king_pos,
                check_path: chk_path,
                game: game,
                white_pieces: w_pieces,
                black_pieces: b_pieces
            }]), //배열에 추가
            stepNumber: history.length,
            selected:[],
            moveable:[],
            next: (this.state.next=='white'? 'black':'white'),
            promotion: null
        });

        for(let i=0;i<64;i++){
            document.getElementsByClassName("square")[i].disabled = false;
        }
    }


    jumpTo(step){
        this.setState({
            stepNumber: step,
            selected:[],
            moveable:[],
            promotion: null,
            next: ((step%2)===0?'white':'black')
        });
        if(!(this.state.game=='continue' || this.state.game=='continue')){
            for(let i=0;i<64;i++){
                document.getElementsByClassName("square")[i].disabled = false;
            }
        }
        for(let i=0;i<64;i++){
            document.getElementsByClassName("square-container")[i].classList.remove('selected');
            document.getElementsByClassName("square-container")[i].classList.remove('moveable');
        }
    }


    render(){
        const history = this.state.history;
        // const current = history[0];
        const current = history[this.state.stepNumber];
        let game = current.game;

        const moves = history.map((step,move)=>{ //배열을 가공하여 새로운 배열 반환(item,index)
            const desc = move? 'go to move #'+move:'go to game start';

            return(
                <li key={move}>
                    <button onClick={()=>this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        return(
            <div className="game">
                <div className="container">
                    <div className="game-board">
                        <Board select={(p)=>this.selectedPiece(p)} squares={current.squares}/>
                    </div>
                    <Pieces next={this.state.next} pro={this.state.promotion} promotion={(val,pc)=>this.promotion(val,pc)}/>
                </div>
                <div id="game-info">
                    <p>now: {this.state.next}</p>
                    <h1>{game}</h1>
                    <ol>{moves}</ol>
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