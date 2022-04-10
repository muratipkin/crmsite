import React from "react";

const SubHeaderComponent = (props) => {
    return(
        <div style={{display:'flex'}} className={"mt-3"}>
            <button onClick={props.action.uri} className={props.action.class}>
                {props.action.title}
            </button>
            <input className={"form-control ms-2 border-3"} type={"text"} placeholder={"Ara..."}
                   onChange={props.filter} style={{flex:1}}/>
        </div>
    );
};
export default SubHeaderComponent;
