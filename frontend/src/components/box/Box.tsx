import { FC } from "react";
import style from './Box.module.css';

const Box: FC<{}> = ({ children, ...props }) => {

    return (<div {...props} className={style.box}>{children}</div>)
}

export default Box;