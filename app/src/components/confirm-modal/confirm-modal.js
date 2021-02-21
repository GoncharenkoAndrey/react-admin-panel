import React from "react";
const ConfirmModal = ({modal, target, method, text}) => {
	const {title, description, button} = text;
	return (
		<div id={target} uk-modal={modal.toString()}>
    		<div className="uk-modal-dialog uk-modal-body">
        		<h2 className="uk-modal-title">{title}</h2>
        		<p>{description}</p>
        		<p className="uk-text-right">
            		<button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Отменить</button>
            		<button className="uk-button uk-button-primary"
						type="button"
						onClick={() => {method()}}>{button}</button>
       			</p>
    		</div>
		</div>
	);
};
export default ConfirmModal;