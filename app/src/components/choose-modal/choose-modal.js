import React from "react";
const ChooseModal = ({modal, target, data, redirect}) => {
	const list = data.map(item => {
		if(data.time) {
			return (
				<li key={item}>
					<a className="uk-link-muted uk-modal-close" href="#"
						onClick={(event) => {redirect(event, item.file)}}>Резервная копия от {item.time}</a>
				</li>
			);
		}
		else {
			return (
				<li key={item}>
					<a className="uk-link-muted uk-modal-close" href="#"
						onClick={(event) => {redirect(event, item)}}>{item}</a>
				</li>
			);
		}
		
	});
	let message;
	if(data.length < 1) {
		message = <div>Резервные копии не найдены!</div>
	}
	return (
		<div id={target} uk-modal={modal.toString()}>
    		<div className="uk-modal-dialog uk-modal-body">
        		<h2 className="uk-modal-title">Открыть</h2>
				{message}
				<ul className="uk-list uk-list-divider">
    				{list}
				</ul>
        		<p className="uk-text-right">
            		<button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
				</p>
    		</div>
		</div>
	);
};
export default ChooseModal;