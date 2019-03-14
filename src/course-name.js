import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CourseName extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
					text-align: center;
				}
			</style>
			<div>[[name]]</div>

			<!--<h2>NextCourseHref is [[nextCourseHref]]</h2>
			<div>Token is [[token]]</div>
			<div>Href is [[href]]</div>-->
		`;
	}
	static get properties() {
		return {
			name: {
				type: String,
				computed: '_getName(entity)'
			}
		};
	}

	static get is() { return 'course-name'; }

	_getName(entity) {
		return entity && entity.properties && entity.properties.name || '';
	}
}

window.customElements.define(CourseName.is, CourseName);
