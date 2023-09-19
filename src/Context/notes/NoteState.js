import React from "react";
import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const s1 = {
        "name" : "Abhi",
        "class" : "6A"
    }
    const [state, setState] = useState(s1)
    const update = ()=> {
        setTimeout(() => {
            setState({
                "name" : "Apoorv",
                "class" : "7A"
            })
        }, 1000);
    }
    //<NoteContext.Provider value= {state}> //will provide the state of every note. Value is providing noteState 
    //{state, update} here these are an object where state value is state and update value is update
    return(
        
        <NoteContext.Provider value= {{state, update}}> 
            {props.children}
        </NoteContext.Provider>
    )

    }


export default NoteState;