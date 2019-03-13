import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CourseEnrollment extends mixinBehaviors([
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
			<course-card href="[[orgHref]]" token="[[token]]" pinnned="[[isPinned]]"></course-card>
		`;
	}

	static get properties() {
		return {
			orgHref: {
				type: String,
				computed: '_getOrgHref(entity)'
			},
			isPinned: {
				type: Boolean,
				computed: '_getPinState(entity)'
			}
		};
	}

	static get is() { return 'course-enrollment'; }

	_getOrgHref(entity) {
		var org = entity && entity.getLinkByRel('https://api.brightspace.com/rels/organization');
		if (org) {
			return org.href;
		}
		return null;
	}

	_getPinState(entity) {
		return entity && entity.hasClass('pinned');
	}
}

window.customElements.define(CourseEnrollment.is, CourseEnrollment);
