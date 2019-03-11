import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-icons/tier1-icons.js';

/**
 * @customElement
 * @polymer
 */
class CoursePin extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: inline-block;
				}

				d2l-icon {
					color: white;
					width: 18px;
					height: 18px;
				}
			</style>
			<d2l-button-icon
				translucent=""
				hidden$="[[!isPinned]]"
				text="Pinned Course"
				icon="d2l-tier1:pin-filled">
			</d2l-button-icon>
		`;
	}
	static get properties() {
		return {
			isPinned: {
				type: Boolean,
				computed: '_getPinState(entity)'
			}
		};
	}

	static get is() { return 'course-pin'; }

	_getPinState(entity) {
		return entity && entity.hasClass('pinned');
	}
}

window.customElements.define(CoursePin.is, CoursePin);
