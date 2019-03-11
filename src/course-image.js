import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CourseImage extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: inline-block;
				}

				img {
					display: block;
					width: 100%;
				}
			</style>
			
			<img src="[[imageHref]]">
		`;
	}
	static get properties() {
		return {
			imageHref: {
				type: String,
				computed: '_getImageHref(entity)'
			}
		};
	}

	static get is() { return 'course-image'; }

	_getImageHref(entity) {
		if (entity && entity.hasSubEntityByClass('course-image')) {
			var imageEntity = entity.getSubEntityByClass('course-image');
			console.log(imageEntity.href);
			return imageEntity.href;
		}

		return null;
	}
}

window.customElements.define(CourseImage.is, CourseImage);
