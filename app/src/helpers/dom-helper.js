export default class DOMHelper {
	static parseSrtingToDOM(html) {
		const parser = new DOMParser();
		return parser.parseFromString(html, "text/html");
	}
	static wrapTextNodes(DOM) {
		const body = DOM.body;
		const textNodes = [];
		function findTextNode(element) {
			element.childNodes.forEach(node => {
				if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g).length > 0) {
					textNodes.push(node);
				}
				else {
					findTextNode(node);
				}
			});
		}
		findTextNode(body);
		textNodes.forEach((node, i) => {
			const wrapper = DOM.createElement("text-editor");
			node.parentNode.replaceChild(wrapper, node);
			wrapper.appendChild(node);
			wrapper.setAttribute("nodeid", i);
		});
		return DOM;
	}
	static serializeDOMToString(DOM) {
		const serializer = new XMLSerializer();
		return serializer.serializeToString(DOM);
	}
	static unmwrapTextNodes(DOM) {
		DOM.body.querySelectorAll("text-editor").forEach(element => {
			element.parentNode.replaceChild(element.firstChild, element);
		});
	}
	static wrapImages(DOM) {
		DOM.body.querySelectorAll("img").forEach((image, i) => {
			image.setAttribute("editableimageid", i);
		});
		return DOM;
	}
	static unwrapImages(DOM) {
		DOM.body.querySelectorAll("[editableimageid]").forEach((image) => {
			image.removeAttribute("editableimageid");
		});
	}
}