// import React,{Component} from "react";

// export default class Pieces extends Component{
//     constructor(props){
//         super(props);

//         this.state={
//             status: 'alive'
//         };
//     }


// }


function Pieces(props){
    return(
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default Pieces;