import React, {Component} from "react";
import axios from "axios";
import UIkit from "uikit";
import "../../helpers/iframeLoader.js";
import DOMHelper from "../../helpers/dom-helper";
import EditorText from "../editor-text/editor-text";
import Spinner from "../spinner/spinner";
import ConfirmModal from "../confirm-modal/confirm-modal";
import ChooseModal from "../choose-modal/choose-modal";
import Panel from "../panel/panel";
import EditorMeta from "../editor-meta/editor-meta";
import EditorImages from "../editor-images/editor-images";
import Login from "../login/login";
export default class Editor extends Component {
	constructor() {
		super();
		this.currentPage = "index.html";
		this.state = {
			pageList: [],
			backupsList: [],
			newPageName: "",
			loading: true,
			auth: false,
			loginError: false,
			loginLengthError: false
		};
		this.setLoading = this.setLoading.bind(this);
		this.setLoaded = this.setLoaded.bind(this);
		this.save = this.save.bind(this);
		this.init = this.init.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.restoreBackup = this.restoreBackup.bind(this);
	}
	componentDidMount() {
		this.checkAuth();
	}
	componentDidUpdate(prevProps, prevState) {
		if(this.state.auth !== prevState.auth) {
			this.init(null, this.currentPage);
		}
	}
	checkAuth() {
		axios.get("./api/checkAuth.php")
		.then(response => {
			this.setState({
				auth: response.data.auth
			});
		});
	}
	login(password) {
		if(password.length > 5) {
			axios.post("./api/login.php", {"password": password})
			.then(response => {
				this.setState({
					auth: response.data.auth,
					loginError: !response.data.auth,
					loginLengthError: false
				});
			});
		}
		else {
			this.setState({
				loginError: false,
				loginLengthError: true
			});
		}
	}
	logout() {
		axios.get("./api/logout.php")
		.then(() => {
			window.location.replace("/");
		});
	}
	init(event, page) {
		if(event){
			event.preventDefault();
		}
		if(this.state.auth) {
			this.setLoading();
			this.iframe = document.querySelector("iframe");
			this.open(page, this.setLoaded);
			this.loadPageList();
			this.loadBackupsList();
		}
	}
	open(page, callback) {
		this.currentPage = page;
		axios.get(`../${page}?random=${Math.random()}`)
			.then(response => DOMHelper.parseSrtingToDOM(response.data))
			.then(DOMHelper.wrapTextNodes)
			.then(DOMHelper.wrapImages)
			.then(DOM => {
				this.virtualDOM = DOM;
				return DOM;
			})
			.then(DOMHelper.serializeDOMToString)
			.then(html => axios.post("./api/saveTempPage.php", {html}))
			.then(() => this.iframe.load("../temp_123456.html"))
			.then(() => axios.post("./api/deleteTempPage.php"))
			.then(() => this.enableEditing())
			.then(() => this.injectStyles())
			.then(callback);
		this.loadBackupsList();
	}
	async save() {
		this.setLoading();
		const newDOM = this.virtualDOM.cloneNode(this.virtualDOM);
		DOMHelper.unmwrapTextNodes(newDOM);
		DOMHelper.unmwrapImages(newDOM);
		const html = this.serializeDOMToString(newDom);
		await axios.post("./api/savePage.php", {pageName: this.currentPage, html})
		.then(() => this.showNotification("Успешно сохранено", "success"))
		.catch(() => this.showNotification("Ошибка сохранения", "danger"))
		.finally(this.setLoaded);
		this.loadBackupsList();
	}
	enableEditing() {
		this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
			const id = element.getAttribute("nodeid");
			const virtualElement = this.virtualDOM.body.querySelector(`[nodeid="${id}"]`);
			new EditorText(element, virtualElement);
		});
		this.iframe.contentDocument.body.querySelectorAll("[editableimageid]").forEach(element => {
			const id = element.getAttribute("editableimageid");
			const virtualElement = this.virtualDOM.body.querySelector(`[editableimageid="${id}"]`);
			new EditorImages(element, virtualElement, this.setLoading, this.setLoaded, this.showNotification);
		});
	}
	injectStyles() {
		const style = this.iframe.contentDocument.createElement("style");
		style.innerHTML = `
			text-editor:hover {
				outline: 3px solid orange;
				outline-offset: 8px; 
			}
			text-editor:focus {
				outline: 3px solid red;
				outline-offset: 8px; 
			}
			[editableimageid]:hover {
				outline: 3px solid orange;
				outline-offset: 8px; 
			}
		`;
		this.iframe.contentDocument.head.appendChild(style);
	}
	showNotification(message, status) {
		UIkit.notification({message, status});
	}
	loadPageList() {
		axios.get("./api/pageList.php").then(response => this.setState({pageList: response.data}));
	}
	loadBackupsList() {
		axios.get("./backups/backups.json")
		.then(response => this.setState({backupsList: response.data.filter(backup => {
			return backup.page === this.currentPage;
		})}));
	}
	restoreBackup(event, backup) {
		if(event){
			event.preventDefault();
		}
		UIkit.modal("Вы действительно хотите восстановить эту страницу из резервной копии? Все несохраненные данные будут потеряны!",
			{labels: {ok: "Восстановить", cancel: "Отмена"}})
		.then(() => {
			this.setLoading();
			return axios.post("./api/restoreBackup.php", {"page": this.currentPage, "file": backup});
		})
		.then(() => {
			this.open(this.currentPage, this.setLoaded);
		});
	}
	setLoading() {
		this.setState({loading: true});
	}
	setLoaded() {
		this.setState({loading: false});
	}
	render() {
		const modal = true;
		const {loading, pageList, backupsList, auth, loginError, loginLengthError} = this.state;
		const spinner = loading ? <Spinner active /> : <Spinner />;
		if(!auth) {
			return <Login login={this.login} loginError = {loginError} loginLengthError = {loginLengthError}/>;
		}
		return (
			<>
				<Panel />
				<iframe src = "" frameBorder = "0"></iframe>
				<input id = "image-upload" type = "file" accept="image/*" style={{display: "none"}} />
				{spinner}
				<ConfirmModal
					modal={modal}
					target={"modal-save"}
					method={this.save}
					text = {{
						title: "Сохранение",
						description: "Вы действительно хотите сохранить изменения?",
						button: "Опубликовать"
				}} />
				<ConfirmModal
					modal={modal}
					target={"modal-logout"}
					method={this.logout}
					text = {{
						title: "Выход",
						description: "Вы действительно хотите выйти?",
						button: "Выйти"
				}} />
				<ChooseModal modal={modal} target={"modal-open"} data={pageList} redirect={this.init}/>
				<ChooseModal modal={modal} target={"modal-backup"} data = {backupsList} redirect={this.restoreBackup}/>
				{this.virtualDOM ? <EditorMeta modal={modal} target={"modal-meta"} virtualDOM = {this.virtualDOM} /> : false}
			</>
		);
	}
}