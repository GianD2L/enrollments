import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CoursesSearch extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<courses-list href="[[enrollmentsSearch]]" token="[[token]]"></courses-list>
		`;
	}
	static get properties() {
		return {
			enrollmentsSearch: {
				type: String,
				computed: '_getEnrollmentsSearch(entity)'
			}
		};
	}

	static get is() { return 'courses-search'; }

	_getEnrollmentsSearch(entity) {
		var enrollmentsSearchAction = entity && entity.getActionByName('search-my-enrollments');
		if (enrollmentsSearchAction) {
			return enrollmentsSearchAction.href;
		}
		return null
	}
}

window.customElements.define(CoursesSearch.is, CoursesSearch);
