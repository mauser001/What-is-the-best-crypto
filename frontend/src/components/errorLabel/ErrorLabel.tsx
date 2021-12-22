import { FC } from "react";
import style from './ErrorLabel.module.css';

interface Props {
    errorText?: string
}

const ErrorLabel: FC<Props> = ({ errorText, ...props }) => {

    return (
        <>
            {errorText && errorText.length > 0 && <div {...props} className={style.errorLabel} >{errorText}</div>}
        </>
    )
}

export default ErrorLabel;