export default class EditorText {
	constructor(element, virtualElement) {
		this.element = element;
		this.virtualElement = virtualElement;
		this.element.addEventListener("click", () => this.onClick());
		this.element.addEventListener("blur", () => this.onBlur());
		this.element.addEventListener("keypress", (event) => this.onKeypress(event));
		if(this.element.parentNode.nodeName === "A" || this.element.parentNode.nodeName === "BUTTON"){
			this.element.addEventListener("contextmenu", (event) => this.onContextMenu(event));
		}
		this.element.addEventListener("input", () => {this.onTextEdit()});
		
	}
	onContextMenu(event) {
		event.preventDefault();
		this.onClick();
	}
	onClick() {
		this.element.contentEditable = "true";
		this.element.focus();
	}
	onBlur() {
		this.element.removeAttribute("contenteditable");
	}
	onKeypress(event) {
		if(event.keyCode === 13) {
			this.element.blur();
		}
	}
	onTextEdit() {
		this.virtualElement.innerHTML = this.element.innerHTML;
	}
}