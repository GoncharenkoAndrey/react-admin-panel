import axios from "axios";
export default class EditorImages {
	constructor(element, virtualElement, ...[setLoading, setLoaded, showNotification]) {
		this.element = element;
		this.virtualElement = virtualElement;
		this.element.addEventListener("click", () => {this.onClick()});
		this.imageUploader = document.querySelector("#image-upload");
		this.setLoading = setLoading;
		this.setLoaded = setLoaded;
		this.showNotification = showNotification;
	}
	onClick() {
		this.imageUploader.click();
		this.imageUploader.addEventListener("change", () => {
			if(this.imageUploader.files && this.imageUploader.files[0]) {
				let formData = new FormData();
				formData.append("image", this.imageUploader.files[0]);
				this.setLoading();
				axios.post("./api/uploadImage.php", formData, {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				})
				.then((response) => {
					this.virtualElement.src = this.element.src = `./img/${response.data.src}`;
				})
				.catch(() => this.showNotification("Ошибка сохранения", "danger"))
				.finally(() => {
					this.imageUploader.value = "";
					this.setLoaded();
				});
			}
		});
	}
}