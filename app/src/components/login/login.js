import React, {Component} from "react";
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: ""
		};
	}
	onPasswordChange(event) {
		this.setState({
			password: event.target.value
		});
	}
	render() {
		const {password} = this.state;
		const {login, loginError, loginLengthError} = this.props;
		let renderLoginError, renderLengthError;
		renderLoginError = loginError ? <span className="login-error">Введен неправильный пароль!</span> : null;
		renderLengthError = loginLengthError ? <span className="login-error">Пароль должен быть длиннее 5 символов</span> : null;
		return(
			<div className = "login-container">
				<div className = "login">
					<h2 className = "uk-modal-title uk-text-center">Авторизация</h2>
					<div className = "uk-margin-top uk-text-lead">
						Пароль:
					</div>
					<input type = "password"
					name = ""
					id = ""
					className = "uk-input uk-margin-top"
					value = {password}
					placeholder = "Пароль"
					onChange = {(event) => this.onPasswordChange(event)} />
					{renderLoginError}
					{renderLengthError}
					<button
						className = "uk-button uk-button-primary uk-margin-top"
						type = "button"
						onClick={() => login(password)}>
						Вход
					</button>
				</div>
			</div>
		);
	}
}