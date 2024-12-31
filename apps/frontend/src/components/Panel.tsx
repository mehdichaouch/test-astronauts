import { PropsWithChildren } from "react";
import style from './Panel.module.css';


interface PanelProps extends PropsWithChildren {
    isVisible: boolean
}

export function Panel({children, isVisible}: PanelProps) {

    const displayStyle = { display : isVisible ? "block" : "none" };

    return (
        <div className={style['panel']} style={displayStyle}>
            {children}
        </div>
    )
}