import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CourseCard extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				.course-card-container {
					border: 2px solid red;
					border-radius: 5px;
					background-color: lightgrey;
				}
			</style>
			<h2>Course Card</h2>
			<div class="course-card-container">
				<course-name href="[[href]]" token="[[token]]"></course-name>
				<course-pin href="[[enrollment]]" token="[[token]]"></course-pin>
			</div>
		`;
	}
	static get properties() {
		return {
			enrollment: {
				type: String
			}
		};
	}

	static get is() { return 'course-card'; }
}

window.customElements.define(CourseCard.is, CourseCard);
