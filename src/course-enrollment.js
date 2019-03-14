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
			<course-card href="[[orgHref]]" token="[[token]]" pinned="[[isPinned]]" pin-action="[[pinAction]]"></course-card>
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
			},
			pinAction: {
				type: Object,
				computed: '_getPinAction(entity)'
			}
		};
	}

	static get is() { return 'course-enrollment'; }

	_getOrgHref(entity) {
		var org = entity && entity.getLinkByRel('https://api.brightspace.com/rels/organization');
		return org && org.href;
	}

	_getPinState(entity) {
		return entity && entity.hasClass('pinned');
	}

	_getPinAction(entity) {
		return entity && (this.isPinned ? entity.getActionByName('unpin-course') : entity.getActionByName('pin-course'));
	}
}

window.customElements.define(CourseEnrollment.is, CourseEnrollment);
